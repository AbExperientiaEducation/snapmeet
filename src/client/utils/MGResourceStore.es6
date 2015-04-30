const MeetgunDispatcher = require('../dispatcher/MeetgunDispatcher.es6')
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const Immutable = require('immutable')
const RelationStore = require('../stores/RelationStore.es6')
const PubSubStore = require('./PubSubStore.es6')
const CHANGE_EVENT = 'store_contents_change'

class MGResourceStore {
  constructor(opts) {
    Object.assign(this, PubSubStore)
    this.restActions = opts.constants.ActionTypes
    this.type = opts.constants.LABEL
    this.ResourceAPI = opts.ResourceAPI
    this.createFn = opts.createFn
    this._cachedResources = Immutable.Map()
    this._subscribedResources = Immutable.Map()
    this.registerForDispatch()
    this.setMaxListeners(100)
  }

  _subscribeToResource(resourceId) {
    if(this._subscribedResources.get(resourceId)) return
    this.ResourceAPI.subscribeToResource(resourceId)
    this._subscribedResources = this._subscribedResources.set(resourceId, true)
  }

  _subscribeToResources(resourceIds) {
    const toFetch = resourceIds.filter(id => {
      return !this._subscribedResources.has(id)
    })
    if(toFetch.length) {
      this.ResourceAPI.subscribeToResources(toFetch)
      this._subscribedResources = this._subscribedResources.withMutations(subs => {
        toFetch.forEach(id => {subs.set(id, true)})
      })
    }
  }

  _addResources(rawResources) {
    rawResources.forEach( (resource) => {
      // Always add to _tasks, or replace whatever was there.
      const inflatedResource = this.ResourceAPI.inflateRecord(resource)
      this._cachedResources = this._cachedResources.set(resource.id, inflatedResource)
    })
  }

  get(id) {
    const resource = this._cachedResources.get(id)
    if(!resource) this._subscribeToResource(id)
    return resource
  }

  getAll() {
    return this._cachedResources
  }

  getResourcesFromRelation(relationId, relationshipName) {
    const relations = RelationStore.getRelations(relationId)
    let result
    if(relations && relations[relationshipName]) {
      const resourceIds = relations[relationshipName]
      this._subscribeToResources(resourceIds)
      const loaded = this._cachedResources.filter(r => resourceIds.indexOf(r.id) > -1)
      // Return null unless we have everything/are done loading
      result = loaded.count() != resourceIds.length ? null : loaded
    } else {
      result = []
    }
    return result
  }

  emitChange() {
    this.emit(CHANGE_EVENT)
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback)
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback)
  }

  patch(updatedRecord) {
    this.ResourceAPI.updateRecord(updatedRecord)
  }

  registerForDispatch() {
    this.dispatchToken = MeetgunDispatcher.register((action) => {
      switch(action.type) {
        case this.restActions.CREATE:
          this.createFn(action)
          break

        case this.restActions.PATCH:
          this.patch(action.record)
          break

        case ResourceConstants.RECEIVE_RAW_EVENT:
          if(!action.groupedRawResources[this.type]) return
          this._addResources(action.groupedRawResources[this.type])
          this.emitChange()
          break

        default:
          // no op
        }
    })
  }
}

module.exports = MGResourceStore