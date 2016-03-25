# Snapmeet Databases
Snapmeet uses two databse technologies. Neo4J, for storing structured resources, and MongoDB, for sessions and realtime documents.

## Neo4J
Neo4J is a graph database. Data is represented as stored nodes with properties, plus relations (edges) connecting those nodes.

We store five different node types:
1. Users
2. Tasks
3. Meetings
4. VCRooms

Neo4J process is Java based. We communicate it over its REST API (cypher), using the neo4j node package.

### Users
All snapmeet users are anonymous and semi-ephemeral. We store the following fields:
- id
- createdTimestamp
- name
- email
- password

Users have the following association types:
- USER_MEETING

### Tasks
Tasks are also small records in the Neo4J db. We store:
- id
- createdTimestamp
- dueTimestamp
- completed
- assignees

All task text information is processed by ShareJS and stored in Mongo.

### Meetings
We store:
- id
- createdTimestamp

Meetings have the following association types:
- MEETING_TASK
- MEETING_VCROOM

As with tasks, meeting titles are stored in Mongo and managed by ShareJS.

### VCRooms
We store:
- id
- createdTimestamp

### Record Retrieval
We usually want to return a record plus that records associations. The associations do not include full records; they include the association type, and the id of the associated record.

All requested records except for user follow this pattern. The assumption is that relations back to the user (currently just meeting) are not necessarily of interest to other users in the system.


## Mongo

