const MeetgunDispatcher = require('../dispatcher/MeetgunDispatcher.es6')
const ResourceConstants = require('../../shared/constants/ResourceConstants.es6')
const Immutable = require('immutable')
const PubSubStore = require('../utils/PubSubStore.es6')

/* structure:
 * {
 *   <recordId>: {
 *     <relationType1>: [<associatedRecordIds>]
 *     <relationType2>: [<associatedRecordIds>]
 *   }
 * }
*/
let _relations = {}

const _addRelations = (newRelations) => {
  newRelations.forEach((newRel) => {
    const type = newRel.RelationType
    const n1id = newRel.Node1Id
    const n2id = newRel.Node2Id;
    [newRel.Node1Id, newRel.Node2Id].forEach(nodeId => {
      if(!_relations[nodeId]) _relations[nodeId] = {}
      if(!_relations[nodeId][type]) _relations[nodeId][type] = []
    })
    _relations[n1id][type].push(n2id)
    _relations[n2id][type].push(n1id)
  })
}

const RelationStore = Object.assign({}, PubSubStore, {
  getRelations(id) {
    return _relations[id]
  }
})

RelationStore.dispatchToken = MeetgunDispatcher.register((action) => {
  switch(action.type) {
    case ResourceConstants.RECEIVE_RAW_EVENT:
      if(!action.groupedRawResources.RELATIONS) return
      _addRelations(action.groupedRawResources.RELATIONS)
      RelationStore.emitChange()
      break;

    default:
      // no op
    }
})

module.exports = RelationStore
