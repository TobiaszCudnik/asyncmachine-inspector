export default {
    "cells": [
        {
            "type": "uml.State",
            "id": "Sync",
            "attrs": {"text": {"text": "Sync"}},
            "embeds": [
                "Sync:Exception",
                "Sync:Enabled",
                "Sync:Authenticating",
                "Sync:Authenticated",
                "Sync:Syncing",
                "Sync:Synced",
                "Sync:TaskListSyncEnabled",
                "Sync:GmailEnabled",
                "Sync:GmailSyncEnabled",
                "Sync:FetchingTaskLists",
                "Sync:TaskListsFetched",
                "Sync:QueryLabelsSynced",
                "Sync:SyncingTaskLists",
                "Sync:TaskListsSynced",
                "Sync:Dirty"
            ],
            "z": 1,
            "is_touched": false
        },
        {
            "type": "fsa.State",
            "id": "Sync:Exception",
            "parent": "Sync",
            "attrs": {
                "text": {
                    "text": "Exception"
                }
            },
            "z": 3,
            "size": {
                "width": 81,
                "height": 81
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "Sync:Enabled",
            "parent": "Sync",
            "attrs": {
                "text": {
                    "text": "Enabled"
                }
            },
            "z": 3,
            "size": {
                "width": 63,
                "height": 63
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "Sync:Authenticating",
            "parent": "Sync",
            "attrs": {
                "text": {
                    "text": "Authenticating"
                }
            },
            "z": 3,
            "size": {
                "width": 126,
                "height": 126
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "Sync:Authenticated",
            "parent": "Sync",
            "attrs": {
                "text": {
                    "text": "Authenticated"
                }
            },
            "z": 3,
            "size": {
                "width": 117,
                "height": 117
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "Sync:Syncing",
            "parent": "Sync",
            "attrs": {
                "text": {
                    "text": "Syncing"
                }
            },
            "z": 3,
            "size": {
                "width": 63,
                "height": 63
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "Sync:Synced",
            "parent": "Sync",
            "attrs": {
                "text": {
                    "text": "Synced"
                }
            },
            "z": 3,
            "size": {
                "width": 54,
                "height": 54
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "Sync:TaskListSyncEnabled",
            "parent": "Sync",
            "attrs": {
                "text": {
                    "text": "TaskListSyncEnabled"
                }
            },
            "z": 3,
            "size": {
                "width": 171,
                "height": 171
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "Sync:GmailEnabled",
            "parent": "Sync",
            "attrs": {
                "text": {
                    "text": "GmailEnabled"
                }
            },
            "z": 3,
            "size": {
                "width": 108,
                "height": 108
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "Sync:GmailSyncEnabled",
            "parent": "Sync",
            "attrs": {
                "text": {
                    "text": "GmailSyncEnabled"
                }
            },
            "z": 3,
            "size": {
                "width": 144,
                "height": 144
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "Sync:FetchingTaskLists",
            "parent": "Sync",
            "attrs": {
                "text": {
                    "text": "FetchingTaskLists"
                }
            },
            "z": 3,
            "size": {
                "width": 153,
                "height": 153
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "Sync:TaskListsFetched",
            "parent": "Sync",
            "attrs": {
                "text": {
                    "text": "TaskListsFetched"
                }
            },
            "z": 3,
            "size": {
                "width": 144,
                "height": 144
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "Sync:QueryLabelsSynced",
            "parent": "Sync",
            "attrs": {
                "text": {
                    "text": "QueryLabelsSynced"
                }
            },
            "z": 3,
            "size": {
                "width": 153,
                "height": 153
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "Sync:SyncingTaskLists",
            "parent": "Sync",
            "attrs": {
                "text": {
                    "text": "SyncingTaskLists"
                }
            },
            "z": 3,
            "size": {
                "width": 144,
                "height": 144
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "Sync:TaskListsSynced",
            "parent": "Sync",
            "attrs": {
                "text": {
                    "text": "TaskListsSynced"
                }
            },
            "z": 3,
            "size": {
                "width": 135,
                "height": 135
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "Sync:Dirty",
            "parent": "Sync",
            "attrs": {
                "text": {
                    "text": "Dirty"
                }
            },
            "z": 3,
            "size": {
                "width": 50,
                "height": 50
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "uml.State",
            "id": "Auth",
            "name":  {"text": "Auth"},
            "embeds": [
                "Auth:Exception",
                "Auth:Ready",
                "Auth:CredentialsSet",
                "Auth:RefreshingToken",
                "Auth:TokenRefreshed"
            ],
            "z": 1,
            "is_touched": false
        },
        {
            "type": "fsa.State",
            "id": "Auth:Exception",
            "parent": "Auth",
            "attrs": {
                "text": {
                    "text": "Exception"
                }
            },
            "z": 3,
            "size": {
                "width": 81,
                "height": 81
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "Auth:Ready",
            "parent": "Auth",
            "attrs": {
                "text": {
                    "text": "Ready"
                }
            },
            "z": 3,
            "size": {
                "width": 50,
                "height": 50
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "Auth:CredentialsSet",
            "parent": "Auth",
            "attrs": {
                "text": {
                    "text": "CredentialsSet"
                }
            },
            "z": 3,
            "size": {
                "width": 126,
                "height": 126
            },
            "is_set": true,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "Auth:RefreshingToken",
            "parent": "Auth",
            "attrs": {
                "text": {
                    "text": "RefreshingToken"
                }
            },
            "z": 3,
            "size": {
                "width": 135,
                "height": 135
            },
            "is_set": true,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "Auth:TokenRefreshed",
            "parent": "Auth",
            "attrs": {
                "text": {
                    "text": "TokenRefreshed"
                }
            },
            "z": 3,
            "size": {
                "width": 126,
                "height": 126
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "uml.State",
            "id": "Gmail",
            "name":  {"text": "Gmail"},
            "embeds": [
                "Gmail:Exception",
                "Gmail:Enabled",
                "Gmail:SyncingEnabled",
                "Gmail:Dirty",
                "Gmail:SyncingQueryLabels",
                "Gmail:QueryLabelsSynced",
                "Gmail:FetchingLabels",
                "Gmail:LabelsFetched",
                "Gmail:FetchingHistoryId",
                "Gmail:HistoryIdFetched"
            ],
            "z": 1,
            "is_touched": false
        },
        {
            "type": "fsa.State",
            "id": "Gmail:Exception",
            "parent": "Gmail",
            "attrs": {
                "text": {
                    "text": "Exception"
                }
            },
            "z": 3,
            "size": {
                "width": 81,
                "height": 81
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "Gmail:Enabled",
            "parent": "Gmail",
            "attrs": {
                "text": {
                    "text": "Enabled"
                }
            },
            "z": 3,
            "size": {
                "width": 63,
                "height": 63
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "Gmail:SyncingEnabled",
            "parent": "Gmail",
            "attrs": {
                "text": {
                    "text": "SyncingEnabled"
                }
            },
            "z": 3,
            "size": {
                "width": 126,
                "height": 126
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "Gmail:Dirty",
            "parent": "Gmail",
            "attrs": {
                "text": {
                    "text": "Dirty"
                }
            },
            "z": 3,
            "size": {
                "width": 50,
                "height": 50
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "Gmail:SyncingQueryLabels",
            "parent": "Gmail",
            "attrs": {
                "text": {
                    "text": "SyncingQueryLabels"
                }
            },
            "z": 3,
            "size": {
                "width": 162,
                "height": 162
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "Gmail:QueryLabelsSynced",
            "parent": "Gmail",
            "attrs": {
                "text": {
                    "text": "QueryLabelsSynced"
                }
            },
            "z": 3,
            "size": {
                "width": 153,
                "height": 153
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "Gmail:FetchingLabels",
            "parent": "Gmail",
            "attrs": {
                "text": {
                    "text": "FetchingLabels"
                }
            },
            "z": 3,
            "size": {
                "width": 126,
                "height": 126
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "Gmail:LabelsFetched",
            "parent": "Gmail",
            "attrs": {
                "text": {
                    "text": "LabelsFetched"
                }
            },
            "z": 3,
            "size": {
                "width": 117,
                "height": 117
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "Gmail:FetchingHistoryId",
            "parent": "Gmail",
            "attrs": {
                "text": {
                    "text": "FetchingHistoryId"
                }
            },
            "z": 3,
            "size": {
                "width": 153,
                "height": 153
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "Gmail:HistoryIdFetched",
            "parent": "Gmail",
            "attrs": {
                "text": {
                    "text": "HistoryIdFetched"
                }
            },
            "z": 3,
            "size": {
                "width": 144,
                "height": 144
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "uml.State",
            "id": "GmailQuery--QueryLabels-1-",
            "name":  {"text": "GmailQuery 'QueryLabels 1'"},
            "embeds": [
                "GmailQuery 'QueryLabels 1':Exception",
                "GmailQuery 'QueryLabels 1':Enabled",
                "GmailQuery 'QueryLabels 1':Dirty",
                "GmailQuery 'QueryLabels 1':FetchingThreads",
                "GmailQuery 'QueryLabels 1':ThreadsFetched",
                "GmailQuery 'QueryLabels 1':FetchingMsgs",
                "GmailQuery 'QueryLabels 1':MsgsFetched"
            ],
            "z": 1,
            "is_touched": false
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 1':Exception",
            "parent": "GmailQuery--QueryLabels-1-",
            "attrs": {
                "text": {
                    "text": "Exception"
                }
            },
            "z": 3,
            "size": {
                "width": 81,
                "height": 81
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 1':Enabled",
            "parent": "GmailQuery--QueryLabels-1-",
            "attrs": {
                "text": {
                    "text": "Enabled"
                }
            },
            "z": 3,
            "size": {
                "width": 63,
                "height": 63
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 1':Dirty",
            "parent": "GmailQuery--QueryLabels-1-",
            "attrs": {
                "text": {
                    "text": "Dirty"
                }
            },
            "z": 3,
            "size": {
                "width": 50,
                "height": 50
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 1':FetchingThreads",
            "parent": "GmailQuery--QueryLabels-1-",
            "attrs": {
                "text": {
                    "text": "FetchingThreads"
                }
            },
            "z": 3,
            "size": {
                "width": 135,
                "height": 135
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 1':ThreadsFetched",
            "parent": "GmailQuery--QueryLabels-1-",
            "attrs": {
                "text": {
                    "text": "ThreadsFetched"
                }
            },
            "z": 3,
            "size": {
                "width": 126,
                "height": 126
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 1':FetchingMsgs",
            "parent": "GmailQuery--QueryLabels-1-",
            "attrs": {
                "text": {
                    "text": "FetchingMsgs"
                }
            },
            "z": 3,
            "size": {
                "width": 108,
                "height": 108
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 1':MsgsFetched",
            "parent": "GmailQuery--QueryLabels-1-",
            "attrs": {
                "text": {
                    "text": "MsgsFetched"
                }
            },
            "z": 3,
            "size": {
                "width": 99,
                "height": 99
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "uml.State",
            "id": "GmailQuery--QueryLabels-2-",
            "name":  {"text": "GmailQuery 'QueryLabels 2'"},
            "embeds": [
                "GmailQuery 'QueryLabels 2':Exception",
                "GmailQuery 'QueryLabels 2':Enabled",
                "GmailQuery 'QueryLabels 2':Dirty",
                "GmailQuery 'QueryLabels 2':FetchingThreads",
                "GmailQuery 'QueryLabels 2':ThreadsFetched",
                "GmailQuery 'QueryLabels 2':FetchingMsgs",
                "GmailQuery 'QueryLabels 2':MsgsFetched"
            ],
            "z": 1,
            "is_touched": false
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 2':Exception",
            "parent": "GmailQuery--QueryLabels-2-",
            "attrs": {
                "text": {
                    "text": "Exception"
                }
            },
            "z": 3,
            "size": {
                "width": 81,
                "height": 81
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 2':Enabled",
            "parent": "GmailQuery--QueryLabels-2-",
            "attrs": {
                "text": {
                    "text": "Enabled"
                }
            },
            "z": 3,
            "size": {
                "width": 63,
                "height": 63
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 2':Dirty",
            "parent": "GmailQuery--QueryLabels-2-",
            "attrs": {
                "text": {
                    "text": "Dirty"
                }
            },
            "z": 3,
            "size": {
                "width": 50,
                "height": 50
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 2':FetchingThreads",
            "parent": "GmailQuery--QueryLabels-2-",
            "attrs": {
                "text": {
                    "text": "FetchingThreads"
                }
            },
            "z": 3,
            "size": {
                "width": 135,
                "height": 135
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 2':ThreadsFetched",
            "parent": "GmailQuery--QueryLabels-2-",
            "attrs": {
                "text": {
                    "text": "ThreadsFetched"
                }
            },
            "z": 3,
            "size": {
                "width": 126,
                "height": 126
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 2':FetchingMsgs",
            "parent": "GmailQuery--QueryLabels-2-",
            "attrs": {
                "text": {
                    "text": "FetchingMsgs"
                }
            },
            "z": 3,
            "size": {
                "width": 108,
                "height": 108
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 2':MsgsFetched",
            "parent": "GmailQuery--QueryLabels-2-",
            "attrs": {
                "text": {
                    "text": "MsgsFetched"
                }
            },
            "z": 3,
            "size": {
                "width": 99,
                "height": 99
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "uml.State",
            "id": "GmailQuery--QueryLabels-3-",
            "name":  {"text": "GmailQuery 'QueryLabels 3'"},
            "embeds": [
                "GmailQuery 'QueryLabels 3':Exception",
                "GmailQuery 'QueryLabels 3':Enabled",
                "GmailQuery 'QueryLabels 3':Dirty",
                "GmailQuery 'QueryLabels 3':FetchingThreads",
                "GmailQuery 'QueryLabels 3':ThreadsFetched",
                "GmailQuery 'QueryLabels 3':FetchingMsgs",
                "GmailQuery 'QueryLabels 3':MsgsFetched"
            ],
            "z": 1,
            "is_touched": false
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 3':Exception",
            "parent": "GmailQuery--QueryLabels-3-",
            "attrs": {
                "text": {
                    "text": "Exception"
                }
            },
            "z": 3,
            "size": {
                "width": 81,
                "height": 81
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 3':Enabled",
            "parent": "GmailQuery--QueryLabels-3-",
            "attrs": {
                "text": {
                    "text": "Enabled"
                }
            },
            "z": 3,
            "size": {
                "width": 63,
                "height": 63
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 3':Dirty",
            "parent": "GmailQuery--QueryLabels-3-",
            "attrs": {
                "text": {
                    "text": "Dirty"
                }
            },
            "z": 3,
            "size": {
                "width": 50,
                "height": 50
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 3':FetchingThreads",
            "parent": "GmailQuery--QueryLabels-3-",
            "attrs": {
                "text": {
                    "text": "FetchingThreads"
                }
            },
            "z": 3,
            "size": {
                "width": 135,
                "height": 135
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 3':ThreadsFetched",
            "parent": "GmailQuery--QueryLabels-3-",
            "attrs": {
                "text": {
                    "text": "ThreadsFetched"
                }
            },
            "z": 3,
            "size": {
                "width": 126,
                "height": 126
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 3':FetchingMsgs",
            "parent": "GmailQuery--QueryLabels-3-",
            "attrs": {
                "text": {
                    "text": "FetchingMsgs"
                }
            },
            "z": 3,
            "size": {
                "width": 108,
                "height": 108
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 3':MsgsFetched",
            "parent": "GmailQuery--QueryLabels-3-",
            "attrs": {
                "text": {
                    "text": "MsgsFetched"
                }
            },
            "z": 3,
            "size": {
                "width": 99,
                "height": 99
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "uml.State",
            "id": "GmailQuery--QueryLabels-4-",
            "name":  {"text": "GmailQuery 'QueryLabels 4'"},
            "embeds": [
                "GmailQuery 'QueryLabels 4':Exception",
                "GmailQuery 'QueryLabels 4':Enabled",
                "GmailQuery 'QueryLabels 4':Dirty",
                "GmailQuery 'QueryLabels 4':FetchingThreads",
                "GmailQuery 'QueryLabels 4':ThreadsFetched",
                "GmailQuery 'QueryLabels 4':FetchingMsgs",
                "GmailQuery 'QueryLabels 4':MsgsFetched"
            ],
            "z": 1,
            "is_touched": false
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 4':Exception",
            "parent": "GmailQuery--QueryLabels-4-",
            "attrs": {
                "text": {
                    "text": "Exception"
                }
            },
            "z": 3,
            "size": {
                "width": 81,
                "height": 81
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 4':Enabled",
            "parent": "GmailQuery--QueryLabels-4-",
            "attrs": {
                "text": {
                    "text": "Enabled"
                }
            },
            "z": 3,
            "size": {
                "width": 63,
                "height": 63
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 4':Dirty",
            "parent": "GmailQuery--QueryLabels-4-",
            "attrs": {
                "text": {
                    "text": "Dirty"
                }
            },
            "z": 3,
            "size": {
                "width": 50,
                "height": 50
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 4':FetchingThreads",
            "parent": "GmailQuery--QueryLabels-4-",
            "attrs": {
                "text": {
                    "text": "FetchingThreads"
                }
            },
            "z": 3,
            "size": {
                "width": 135,
                "height": 135
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 4':ThreadsFetched",
            "parent": "GmailQuery--QueryLabels-4-",
            "attrs": {
                "text": {
                    "text": "ThreadsFetched"
                }
            },
            "z": 3,
            "size": {
                "width": 126,
                "height": 126
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 4':FetchingMsgs",
            "parent": "GmailQuery--QueryLabels-4-",
            "attrs": {
                "text": {
                    "text": "FetchingMsgs"
                }
            },
            "z": 3,
            "size": {
                "width": 108,
                "height": 108
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 4':MsgsFetched",
            "parent": "GmailQuery--QueryLabels-4-",
            "attrs": {
                "text": {
                    "text": "MsgsFetched"
                }
            },
            "z": 3,
            "size": {
                "width": 99,
                "height": 99
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "uml.State",
            "id": "GmailQuery--QueryLabels-5-",
            "name":  {"text": "GmailQuery 'QueryLabels 5'"},
            "embeds": [
                "GmailQuery 'QueryLabels 5':Exception",
                "GmailQuery 'QueryLabels 5':Enabled",
                "GmailQuery 'QueryLabels 5':Dirty",
                "GmailQuery 'QueryLabels 5':FetchingThreads",
                "GmailQuery 'QueryLabels 5':ThreadsFetched",
                "GmailQuery 'QueryLabels 5':FetchingMsgs",
                "GmailQuery 'QueryLabels 5':MsgsFetched"
            ],
            "z": 1,
            "is_touched": false
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 5':Exception",
            "parent": "GmailQuery--QueryLabels-5-",
            "attrs": {
                "text": {
                    "text": "Exception"
                }
            },
            "z": 3,
            "size": {
                "width": 81,
                "height": 81
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 5':Enabled",
            "parent": "GmailQuery--QueryLabels-5-",
            "attrs": {
                "text": {
                    "text": "Enabled"
                }
            },
            "z": 3,
            "size": {
                "width": 63,
                "height": 63
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 5':Dirty",
            "parent": "GmailQuery--QueryLabels-5-",
            "attrs": {
                "text": {
                    "text": "Dirty"
                }
            },
            "z": 3,
            "size": {
                "width": 50,
                "height": 50
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 5':FetchingThreads",
            "parent": "GmailQuery--QueryLabels-5-",
            "attrs": {
                "text": {
                    "text": "FetchingThreads"
                }
            },
            "z": 3,
            "size": {
                "width": 135,
                "height": 135
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 5':ThreadsFetched",
            "parent": "GmailQuery--QueryLabels-5-",
            "attrs": {
                "text": {
                    "text": "ThreadsFetched"
                }
            },
            "z": 3,
            "size": {
                "width": 126,
                "height": 126
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 5':FetchingMsgs",
            "parent": "GmailQuery--QueryLabels-5-",
            "attrs": {
                "text": {
                    "text": "FetchingMsgs"
                }
            },
            "z": 3,
            "size": {
                "width": 108,
                "height": 108
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 5':MsgsFetched",
            "parent": "GmailQuery--QueryLabels-5-",
            "attrs": {
                "text": {
                    "text": "MsgsFetched"
                }
            },
            "z": 3,
            "size": {
                "width": 99,
                "height": 99
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "uml.State",
            "id": "GmailQuery--QueryLabels-6-",
            "name":  {"text": "GmailQuery 'QueryLabels 6'"},
            "embeds": [
                "GmailQuery 'QueryLabels 6':Exception",
                "GmailQuery 'QueryLabels 6':Enabled",
                "GmailQuery 'QueryLabels 6':Dirty",
                "GmailQuery 'QueryLabels 6':FetchingThreads",
                "GmailQuery 'QueryLabels 6':ThreadsFetched",
                "GmailQuery 'QueryLabels 6':FetchingMsgs",
                "GmailQuery 'QueryLabels 6':MsgsFetched"
            ],
            "z": 1,
            "is_touched": false
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 6':Exception",
            "parent": "GmailQuery--QueryLabels-6-",
            "attrs": {
                "text": {
                    "text": "Exception"
                }
            },
            "z": 3,
            "size": {
                "width": 81,
                "height": 81
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 6':Enabled",
            "parent": "GmailQuery--QueryLabels-6-",
            "attrs": {
                "text": {
                    "text": "Enabled"
                }
            },
            "z": 3,
            "size": {
                "width": 63,
                "height": 63
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 6':Dirty",
            "parent": "GmailQuery--QueryLabels-6-",
            "attrs": {
                "text": {
                    "text": "Dirty"
                }
            },
            "z": 3,
            "size": {
                "width": 50,
                "height": 50
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 6':FetchingThreads",
            "parent": "GmailQuery--QueryLabels-6-",
            "attrs": {
                "text": {
                    "text": "FetchingThreads"
                }
            },
            "z": 3,
            "size": {
                "width": 135,
                "height": 135
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 6':ThreadsFetched",
            "parent": "GmailQuery--QueryLabels-6-",
            "attrs": {
                "text": {
                    "text": "ThreadsFetched"
                }
            },
            "z": 3,
            "size": {
                "width": 126,
                "height": 126
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 6':FetchingMsgs",
            "parent": "GmailQuery--QueryLabels-6-",
            "attrs": {
                "text": {
                    "text": "FetchingMsgs"
                }
            },
            "z": 3,
            "size": {
                "width": 108,
                "height": 108
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 6':MsgsFetched",
            "parent": "GmailQuery--QueryLabels-6-",
            "attrs": {
                "text": {
                    "text": "MsgsFetched"
                }
            },
            "z": 3,
            "size": {
                "width": 99,
                "height": 99
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "uml.State",
            "id": "GmailQuery--QueryLabels-7-",
            "name": "GmailQuery 'QueryLabels 7'",
            "embeds": [
                "GmailQuery 'QueryLabels 7':Exception",
                "GmailQuery 'QueryLabels 7':Enabled",
                "GmailQuery 'QueryLabels 7':Dirty",
                "GmailQuery 'QueryLabels 7':FetchingThreads",
                "GmailQuery 'QueryLabels 7':ThreadsFetched",
                "GmailQuery 'QueryLabels 7':FetchingMsgs",
                "GmailQuery 'QueryLabels 7':MsgsFetched"
            ],
            "z": 1,
            "is_touched": false
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 7':Exception",
            "parent": "GmailQuery--QueryLabels-7-",
            "attrs": {
                "text": {
                    "text": "Exception"
                }
            },
            "z": 3,
            "size": {
                "width": 81,
                "height": 81
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 7':Enabled",
            "parent": "GmailQuery--QueryLabels-7-",
            "attrs": {
                "text": {
                    "text": "Enabled"
                }
            },
            "z": 3,
            "size": {
                "width": 63,
                "height": 63
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 7':Dirty",
            "parent": "GmailQuery--QueryLabels-7-",
            "attrs": {
                "text": {
                    "text": "Dirty"
                }
            },
            "z": 3,
            "size": {
                "width": 50,
                "height": 50
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 7':FetchingThreads",
            "parent": "GmailQuery--QueryLabels-7-",
            "attrs": {
                "text": {
                    "text": "FetchingThreads"
                }
            },
            "z": 3,
            "size": {
                "width": 135,
                "height": 135
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 7':ThreadsFetched",
            "parent": "GmailQuery--QueryLabels-7-",
            "attrs": {
                "text": {
                    "text": "ThreadsFetched"
                }
            },
            "z": 3,
            "size": {
                "width": 126,
                "height": 126
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 7':FetchingMsgs",
            "parent": "GmailQuery--QueryLabels-7-",
            "attrs": {
                "text": {
                    "text": "FetchingMsgs"
                }
            },
            "z": 3,
            "size": {
                "width": 108,
                "height": 108
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery 'QueryLabels 7':MsgsFetched",
            "parent": "GmailQuery--QueryLabels-7-",
            "attrs": {
                "text": {
                    "text": "MsgsFetched"
                }
            },
            "z": 3,
            "size": {
                "width": 99,
                "height": 99
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "uml.State",
            "id": "TaskList--Inbox",
            "name":  {"text": "TaskList !Inbox"},
            "embeds": [
                "TaskList !Inbox:Exception",
                "TaskList !Inbox:Enabled",
                "TaskList !Inbox:Syncing",
                "TaskList !Inbox:Synced",
                "TaskList !Inbox:Restart",
                "TaskList !Inbox:PreparingList",
                "TaskList !Inbox:ListReady",
                "TaskList !Inbox:FetchingTasks",
                "TaskList !Inbox:TasksFetched",
                "TaskList !Inbox:TasksCached",
                "TaskList !Inbox:SyncingThreadsToTasks",
                "TaskList !Inbox:ThreadsToTasksSynced",
                "TaskList !Inbox:SyncingTasksToThreads",
                "TaskList !Inbox:TasksToThreadsSynced",
                "TaskList !Inbox:SyncingCompletedThreads",
                "TaskList !Inbox:CompletedThreadsSynced",
                "TaskList !Inbox:SyncingCompletedTasks",
                "TaskList !Inbox:CompletedTasksSynced",
                "TaskList !Inbox:ThreadsFetched",
                "TaskList !Inbox:MsgsFetched"
            ],
            "z": 1,
            "is_touched": false
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Inbox:Exception",
            "parent": "TaskList--Inbox",
            "attrs": {
                "text": {
                    "text": "Exception"
                }
            },
            "z": 3,
            "size": {
                "width": 81,
                "height": 81
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Inbox:Enabled",
            "parent": "TaskList--Inbox",
            "attrs": {
                "text": {
                    "text": "Enabled"
                }
            },
            "z": 3,
            "size": {
                "width": 63,
                "height": 63
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Inbox:Syncing",
            "parent": "TaskList--Inbox",
            "attrs": {
                "text": {
                    "text": "Syncing"
                }
            },
            "z": 3,
            "size": {
                "width": 63,
                "height": 63
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Inbox:Synced",
            "parent": "TaskList--Inbox",
            "attrs": {
                "text": {
                    "text": "Synced"
                }
            },
            "z": 3,
            "size": {
                "width": 54,
                "height": 54
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Inbox:Restart",
            "parent": "TaskList--Inbox",
            "attrs": {
                "text": {
                    "text": "Restart"
                }
            },
            "z": 3,
            "size": {
                "width": 63,
                "height": 63
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Inbox:PreparingList",
            "parent": "TaskList--Inbox",
            "attrs": {
                "text": {
                    "text": "PreparingList"
                }
            },
            "z": 3,
            "size": {
                "width": 117,
                "height": 117
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Inbox:ListReady",
            "parent": "TaskList--Inbox",
            "attrs": {
                "text": {
                    "text": "ListReady"
                }
            },
            "z": 3,
            "size": {
                "width": 81,
                "height": 81
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Inbox:FetchingTasks",
            "parent": "TaskList--Inbox",
            "attrs": {
                "text": {
                    "text": "FetchingTasks"
                }
            },
            "z": 3,
            "size": {
                "width": 117,
                "height": 117
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Inbox:TasksFetched",
            "parent": "TaskList--Inbox",
            "attrs": {
                "text": {
                    "text": "TasksFetched"
                }
            },
            "z": 3,
            "size": {
                "width": 108,
                "height": 108
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Inbox:TasksCached",
            "parent": "TaskList--Inbox",
            "attrs": {
                "text": {
                    "text": "TasksCached"
                }
            },
            "z": 3,
            "size": {
                "width": 99,
                "height": 99
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Inbox:SyncingThreadsToTasks",
            "parent": "TaskList--Inbox",
            "attrs": {
                "text": {
                    "text": "SyncingThreadsToTasks"
                }
            },
            "z": 3,
            "size": {
                "width": 189,
                "height": 189
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Inbox:ThreadsToTasksSynced",
            "parent": "TaskList--Inbox",
            "attrs": {
                "text": {
                    "text": "ThreadsToTasksSynced"
                }
            },
            "z": 3,
            "size": {
                "width": 180,
                "height": 180
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Inbox:SyncingTasksToThreads",
            "parent": "TaskList--Inbox",
            "attrs": {
                "text": {
                    "text": "SyncingTasksToThreads"
                }
            },
            "z": 3,
            "size": {
                "width": 189,
                "height": 189
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Inbox:TasksToThreadsSynced",
            "parent": "TaskList--Inbox",
            "attrs": {
                "text": {
                    "text": "TasksToThreadsSynced"
                }
            },
            "z": 3,
            "size": {
                "width": 180,
                "height": 180
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Inbox:SyncingCompletedThreads",
            "parent": "TaskList--Inbox",
            "attrs": {
                "text": {
                    "text": "SyncingCompletedThreads"
                }
            },
            "z": 3,
            "size": {
                "width": 207,
                "height": 207
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Inbox:CompletedThreadsSynced",
            "parent": "TaskList--Inbox",
            "attrs": {
                "text": {
                    "text": "CompletedThreadsSynced"
                }
            },
            "z": 3,
            "size": {
                "width": 198,
                "height": 198
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Inbox:SyncingCompletedTasks",
            "parent": "TaskList--Inbox",
            "attrs": {
                "text": {
                    "text": "SyncingCompletedTasks"
                }
            },
            "z": 3,
            "size": {
                "width": 189,
                "height": 189
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Inbox:CompletedTasksSynced",
            "parent": "TaskList--Inbox",
            "attrs": {
                "text": {
                    "text": "CompletedTasksSynced"
                }
            },
            "z": 3,
            "size": {
                "width": 180,
                "height": 180
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Inbox:ThreadsFetched",
            "parent": "TaskList--Inbox",
            "attrs": {
                "text": {
                    "text": "ThreadsFetched"
                }
            },
            "z": 3,
            "size": {
                "width": 126,
                "height": 126
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Inbox:MsgsFetched",
            "parent": "TaskList--Inbox",
            "attrs": {
                "text": {
                    "text": "MsgsFetched"
                }
            },
            "z": 3,
            "size": {
                "width": 99,
                "height": 99
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "uml.State",
            "id": "GmailQuery---Inbox-",
            "name":  {"text": "GmailQuery '!Inbox'"},
            "embeds": [
                "GmailQuery '!Inbox':Exception",
                "GmailQuery '!Inbox':Enabled",
                "GmailQuery '!Inbox':Dirty",
                "GmailQuery '!Inbox':FetchingThreads",
                "GmailQuery '!Inbox':ThreadsFetched",
                "GmailQuery '!Inbox':FetchingMsgs",
                "GmailQuery '!Inbox':MsgsFetched"
            ],
            "z": 1,
            "is_touched": false
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery '!Inbox':Exception",
            "parent": "GmailQuery---Inbox-",
            "attrs": {
                "text": {
                    "text": "Exception"
                }
            },
            "z": 3,
            "size": {
                "width": 81,
                "height": 81
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery '!Inbox':Enabled",
            "parent": "GmailQuery---Inbox-",
            "attrs": {
                "text": {
                    "text": "Enabled"
                }
            },
            "z": 3,
            "size": {
                "width": 63,
                "height": 63
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery '!Inbox':Dirty",
            "parent": "GmailQuery---Inbox-",
            "attrs": {
                "text": {
                    "text": "Dirty"
                }
            },
            "z": 3,
            "size": {
                "width": 50,
                "height": 50
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery '!Inbox':FetchingThreads",
            "parent": "GmailQuery---Inbox-",
            "attrs": {
                "text": {
                    "text": "FetchingThreads"
                }
            },
            "z": 3,
            "size": {
                "width": 135,
                "height": 135
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery '!Inbox':ThreadsFetched",
            "parent": "GmailQuery---Inbox-",
            "attrs": {
                "text": {
                    "text": "ThreadsFetched"
                }
            },
            "z": 3,
            "size": {
                "width": 126,
                "height": 126
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery '!Inbox':FetchingMsgs",
            "parent": "GmailQuery---Inbox-",
            "attrs": {
                "text": {
                    "text": "FetchingMsgs"
                }
            },
            "z": 3,
            "size": {
                "width": 108,
                "height": 108
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery '!Inbox':MsgsFetched",
            "parent": "GmailQuery---Inbox-",
            "attrs": {
                "text": {
                    "text": "MsgsFetched"
                }
            },
            "z": 3,
            "size": {
                "width": 99,
                "height": 99
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "uml.State",
            "id": "TaskList--Next",
            "name":  {"text": "TaskList !Next"},
            "embeds": [
                "TaskList !Next:Exception",
                "TaskList !Next:Enabled",
                "TaskList !Next:Syncing",
                "TaskList !Next:Synced",
                "TaskList !Next:Restart",
                "TaskList !Next:PreparingList",
                "TaskList !Next:ListReady",
                "TaskList !Next:FetchingTasks",
                "TaskList !Next:TasksFetched",
                "TaskList !Next:TasksCached",
                "TaskList !Next:SyncingThreadsToTasks",
                "TaskList !Next:ThreadsToTasksSynced",
                "TaskList !Next:SyncingTasksToThreads",
                "TaskList !Next:TasksToThreadsSynced",
                "TaskList !Next:SyncingCompletedThreads",
                "TaskList !Next:CompletedThreadsSynced",
                "TaskList !Next:SyncingCompletedTasks",
                "TaskList !Next:CompletedTasksSynced",
                "TaskList !Next:ThreadsFetched",
                "TaskList !Next:MsgsFetched"
            ],
            "z": 1,
            "is_touched": false
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Next:Exception",
            "parent": "TaskList--Next",
            "attrs": {
                "text": {
                    "text": "Exception"
                }
            },
            "z": 3,
            "size": {
                "width": 81,
                "height": 81
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Next:Enabled",
            "parent": "TaskList--Next",
            "attrs": {
                "text": {
                    "text": "Enabled"
                }
            },
            "z": 3,
            "size": {
                "width": 63,
                "height": 63
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Next:Syncing",
            "parent": "TaskList--Next",
            "attrs": {
                "text": {
                    "text": "Syncing"
                }
            },
            "z": 3,
            "size": {
                "width": 63,
                "height": 63
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Next:Synced",
            "parent": "TaskList--Next",
            "attrs": {
                "text": {
                    "text": "Synced"
                }
            },
            "z": 3,
            "size": {
                "width": 54,
                "height": 54
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Next:Restart",
            "parent": "TaskList--Next",
            "attrs": {
                "text": {
                    "text": "Restart"
                }
            },
            "z": 3,
            "size": {
                "width": 63,
                "height": 63
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Next:PreparingList",
            "parent": "TaskList--Next",
            "attrs": {
                "text": {
                    "text": "PreparingList"
                }
            },
            "z": 3,
            "size": {
                "width": 117,
                "height": 117
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Next:ListReady",
            "parent": "TaskList--Next",
            "attrs": {
                "text": {
                    "text": "ListReady"
                }
            },
            "z": 3,
            "size": {
                "width": 81,
                "height": 81
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Next:FetchingTasks",
            "parent": "TaskList--Next",
            "attrs": {
                "text": {
                    "text": "FetchingTasks"
                }
            },
            "z": 3,
            "size": {
                "width": 117,
                "height": 117
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Next:TasksFetched",
            "parent": "TaskList--Next",
            "attrs": {
                "text": {
                    "text": "TasksFetched"
                }
            },
            "z": 3,
            "size": {
                "width": 108,
                "height": 108
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Next:TasksCached",
            "parent": "TaskList--Next",
            "attrs": {
                "text": {
                    "text": "TasksCached"
                }
            },
            "z": 3,
            "size": {
                "width": 99,
                "height": 99
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Next:SyncingThreadsToTasks",
            "parent": "TaskList--Next",
            "attrs": {
                "text": {
                    "text": "SyncingThreadsToTasks"
                }
            },
            "z": 3,
            "size": {
                "width": 189,
                "height": 189
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Next:ThreadsToTasksSynced",
            "parent": "TaskList--Next",
            "attrs": {
                "text": {
                    "text": "ThreadsToTasksSynced"
                }
            },
            "z": 3,
            "size": {
                "width": 180,
                "height": 180
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Next:SyncingTasksToThreads",
            "parent": "TaskList--Next",
            "attrs": {
                "text": {
                    "text": "SyncingTasksToThreads"
                }
            },
            "z": 3,
            "size": {
                "width": 189,
                "height": 189
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Next:TasksToThreadsSynced",
            "parent": "TaskList--Next",
            "attrs": {
                "text": {
                    "text": "TasksToThreadsSynced"
                }
            },
            "z": 3,
            "size": {
                "width": 180,
                "height": 180
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Next:SyncingCompletedThreads",
            "parent": "TaskList--Next",
            "attrs": {
                "text": {
                    "text": "SyncingCompletedThreads"
                }
            },
            "z": 3,
            "size": {
                "width": 207,
                "height": 207
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Next:CompletedThreadsSynced",
            "parent": "TaskList--Next",
            "attrs": {
                "text": {
                    "text": "CompletedThreadsSynced"
                }
            },
            "z": 3,
            "size": {
                "width": 198,
                "height": 198
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Next:SyncingCompletedTasks",
            "parent": "TaskList--Next",
            "attrs": {
                "text": {
                    "text": "SyncingCompletedTasks"
                }
            },
            "z": 3,
            "size": {
                "width": 189,
                "height": 189
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Next:CompletedTasksSynced",
            "parent": "TaskList--Next",
            "attrs": {
                "text": {
                    "text": "CompletedTasksSynced"
                }
            },
            "z": 3,
            "size": {
                "width": 180,
                "height": 180
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Next:ThreadsFetched",
            "parent": "TaskList--Next",
            "attrs": {
                "text": {
                    "text": "ThreadsFetched"
                }
            },
            "z": 3,
            "size": {
                "width": 126,
                "height": 126
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Next:MsgsFetched",
            "parent": "TaskList--Next",
            "attrs": {
                "text": {
                    "text": "MsgsFetched"
                }
            },
            "z": 3,
            "size": {
                "width": 99,
                "height": 99
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "uml.State",
            "id": "GmailQuery---Next-",
            "name":  {"text": "GmailQuery '!Next'"},
            "embeds": [
                "GmailQuery '!Next':Exception",
                "GmailQuery '!Next':Enabled",
                "GmailQuery '!Next':Dirty",
                "GmailQuery '!Next':FetchingThreads",
                "GmailQuery '!Next':ThreadsFetched",
                "GmailQuery '!Next':FetchingMsgs",
                "GmailQuery '!Next':MsgsFetched"
            ],
            "z": 1,
            "is_touched": false
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery '!Next':Exception",
            "parent": "GmailQuery---Next-",
            "attrs": {
                "text": {
                    "text": "Exception"
                }
            },
            "z": 3,
            "size": {
                "width": 81,
                "height": 81
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery '!Next':Enabled",
            "parent": "GmailQuery---Next-",
            "attrs": {
                "text": {
                    "text": "Enabled"
                }
            },
            "z": 3,
            "size": {
                "width": 63,
                "height": 63
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery '!Next':Dirty",
            "parent": "GmailQuery---Next-",
            "attrs": {
                "text": {
                    "text": "Dirty"
                }
            },
            "z": 3,
            "size": {
                "width": 50,
                "height": 50
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery '!Next':FetchingThreads",
            "parent": "GmailQuery---Next-",
            "attrs": {
                "text": {
                    "text": "FetchingThreads"
                }
            },
            "z": 3,
            "size": {
                "width": 135,
                "height": 135
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery '!Next':ThreadsFetched",
            "parent": "GmailQuery---Next-",
            "attrs": {
                "text": {
                    "text": "ThreadsFetched"
                }
            },
            "z": 3,
            "size": {
                "width": 126,
                "height": 126
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery '!Next':FetchingMsgs",
            "parent": "GmailQuery---Next-",
            "attrs": {
                "text": {
                    "text": "FetchingMsgs"
                }
            },
            "z": 3,
            "size": {
                "width": 108,
                "height": 108
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery '!Next':MsgsFetched",
            "parent": "GmailQuery---Next-",
            "attrs": {
                "text": {
                    "text": "MsgsFetched"
                }
            },
            "z": 3,
            "size": {
                "width": 99,
                "height": 99
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "uml.State",
            "id": "TaskList--Actions",
            "name":  {"text": "TaskList !Actions"},
            "embeds": [
                "TaskList !Actions:Exception",
                "TaskList !Actions:Enabled",
                "TaskList !Actions:Syncing",
                "TaskList !Actions:Synced",
                "TaskList !Actions:Restart",
                "TaskList !Actions:PreparingList",
                "TaskList !Actions:ListReady",
                "TaskList !Actions:FetchingTasks",
                "TaskList !Actions:TasksFetched",
                "TaskList !Actions:TasksCached",
                "TaskList !Actions:SyncingThreadsToTasks",
                "TaskList !Actions:ThreadsToTasksSynced",
                "TaskList !Actions:SyncingTasksToThreads",
                "TaskList !Actions:TasksToThreadsSynced",
                "TaskList !Actions:SyncingCompletedThreads",
                "TaskList !Actions:CompletedThreadsSynced",
                "TaskList !Actions:SyncingCompletedTasks",
                "TaskList !Actions:CompletedTasksSynced",
                "TaskList !Actions:ThreadsFetched",
                "TaskList !Actions:MsgsFetched"
            ],
            "z": 1,
            "is_touched": false
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Actions:Exception",
            "parent": "TaskList--Actions",
            "attrs": {
                "text": {
                    "text": "Exception"
                }
            },
            "z": 3,
            "size": {
                "width": 81,
                "height": 81
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Actions:Enabled",
            "parent": "TaskList--Actions",
            "attrs": {
                "text": {
                    "text": "Enabled"
                }
            },
            "z": 3,
            "size": {
                "width": 63,
                "height": 63
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Actions:Syncing",
            "parent": "TaskList--Actions",
            "attrs": {
                "text": {
                    "text": "Syncing"
                }
            },
            "z": 3,
            "size": {
                "width": 63,
                "height": 63
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Actions:Synced",
            "parent": "TaskList--Actions",
            "attrs": {
                "text": {
                    "text": "Synced"
                }
            },
            "z": 3,
            "size": {
                "width": 54,
                "height": 54
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Actions:Restart",
            "parent": "TaskList--Actions",
            "attrs": {
                "text": {
                    "text": "Restart"
                }
            },
            "z": 3,
            "size": {
                "width": 63,
                "height": 63
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Actions:PreparingList",
            "parent": "TaskList--Actions",
            "attrs": {
                "text": {
                    "text": "PreparingList"
                }
            },
            "z": 3,
            "size": {
                "width": 117,
                "height": 117
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Actions:ListReady",
            "parent": "TaskList--Actions",
            "attrs": {
                "text": {
                    "text": "ListReady"
                }
            },
            "z": 3,
            "size": {
                "width": 81,
                "height": 81
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Actions:FetchingTasks",
            "parent": "TaskList--Actions",
            "attrs": {
                "text": {
                    "text": "FetchingTasks"
                }
            },
            "z": 3,
            "size": {
                "width": 117,
                "height": 117
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Actions:TasksFetched",
            "parent": "TaskList--Actions",
            "attrs": {
                "text": {
                    "text": "TasksFetched"
                }
            },
            "z": 3,
            "size": {
                "width": 108,
                "height": 108
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Actions:TasksCached",
            "parent": "TaskList--Actions",
            "attrs": {
                "text": {
                    "text": "TasksCached"
                }
            },
            "z": 3,
            "size": {
                "width": 99,
                "height": 99
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Actions:SyncingThreadsToTasks",
            "parent": "TaskList--Actions",
            "attrs": {
                "text": {
                    "text": "SyncingThreadsToTasks"
                }
            },
            "z": 3,
            "size": {
                "width": 189,
                "height": 189
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Actions:ThreadsToTasksSynced",
            "parent": "TaskList--Actions",
            "attrs": {
                "text": {
                    "text": "ThreadsToTasksSynced"
                }
            },
            "z": 3,
            "size": {
                "width": 180,
                "height": 180
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Actions:SyncingTasksToThreads",
            "parent": "TaskList--Actions",
            "attrs": {
                "text": {
                    "text": "SyncingTasksToThreads"
                }
            },
            "z": 3,
            "size": {
                "width": 189,
                "height": 189
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Actions:TasksToThreadsSynced",
            "parent": "TaskList--Actions",
            "attrs": {
                "text": {
                    "text": "TasksToThreadsSynced"
                }
            },
            "z": 3,
            "size": {
                "width": 180,
                "height": 180
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Actions:SyncingCompletedThreads",
            "parent": "TaskList--Actions",
            "attrs": {
                "text": {
                    "text": "SyncingCompletedThreads"
                }
            },
            "z": 3,
            "size": {
                "width": 207,
                "height": 207
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Actions:CompletedThreadsSynced",
            "parent": "TaskList--Actions",
            "attrs": {
                "text": {
                    "text": "CompletedThreadsSynced"
                }
            },
            "z": 3,
            "size": {
                "width": 198,
                "height": 198
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Actions:SyncingCompletedTasks",
            "parent": "TaskList--Actions",
            "attrs": {
                "text": {
                    "text": "SyncingCompletedTasks"
                }
            },
            "z": 3,
            "size": {
                "width": 189,
                "height": 189
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Actions:CompletedTasksSynced",
            "parent": "TaskList--Actions",
            "attrs": {
                "text": {
                    "text": "CompletedTasksSynced"
                }
            },
            "z": 3,
            "size": {
                "width": 180,
                "height": 180
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Actions:ThreadsFetched",
            "parent": "TaskList--Actions",
            "attrs": {
                "text": {
                    "text": "ThreadsFetched"
                }
            },
            "z": 3,
            "size": {
                "width": 126,
                "height": 126
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Actions:MsgsFetched",
            "parent": "TaskList--Actions",
            "attrs": {
                "text": {
                    "text": "MsgsFetched"
                }
            },
            "z": 3,
            "size": {
                "width": 99,
                "height": 99
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "uml.State",
            "id": "GmailQuery---Actions-",
            "name":  {"text": "GmailQuery '!Actions'"},
            "embeds": [
                "GmailQuery '!Actions':Exception",
                "GmailQuery '!Actions':Enabled",
                "GmailQuery '!Actions':Dirty",
                "GmailQuery '!Actions':FetchingThreads",
                "GmailQuery '!Actions':ThreadsFetched",
                "GmailQuery '!Actions':FetchingMsgs",
                "GmailQuery '!Actions':MsgsFetched"
            ],
            "z": 1,
            "is_touched": false
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery '!Actions':Exception",
            "parent": "GmailQuery---Actions-",
            "attrs": {
                "text": {
                    "text": "Exception"
                }
            },
            "z": 3,
            "size": {
                "width": 81,
                "height": 81
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery '!Actions':Enabled",
            "parent": "GmailQuery---Actions-",
            "attrs": {
                "text": {
                    "text": "Enabled"
                }
            },
            "z": 3,
            "size": {
                "width": 63,
                "height": 63
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery '!Actions':Dirty",
            "parent": "GmailQuery---Actions-",
            "attrs": {
                "text": {
                    "text": "Dirty"
                }
            },
            "z": 3,
            "size": {
                "width": 50,
                "height": 50
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery '!Actions':FetchingThreads",
            "parent": "GmailQuery---Actions-",
            "attrs": {
                "text": {
                    "text": "FetchingThreads"
                }
            },
            "z": 3,
            "size": {
                "width": 135,
                "height": 135
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery '!Actions':ThreadsFetched",
            "parent": "GmailQuery---Actions-",
            "attrs": {
                "text": {
                    "text": "ThreadsFetched"
                }
            },
            "z": 3,
            "size": {
                "width": 126,
                "height": 126
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery '!Actions':FetchingMsgs",
            "parent": "GmailQuery---Actions-",
            "attrs": {
                "text": {
                    "text": "FetchingMsgs"
                }
            },
            "z": 3,
            "size": {
                "width": 108,
                "height": 108
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery '!Actions':MsgsFetched",
            "parent": "GmailQuery---Actions-",
            "attrs": {
                "text": {
                    "text": "MsgsFetched"
                }
            },
            "z": 3,
            "size": {
                "width": 99,
                "height": 99
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "uml.State",
            "id": "TaskList--Waiting",
            "name":  {"text": "TaskList !Waiting"},
            "embeds": [
                "TaskList !Waiting:Exception",
                "TaskList !Waiting:Enabled",
                "TaskList !Waiting:Syncing",
                "TaskList !Waiting:Synced",
                "TaskList !Waiting:Restart",
                "TaskList !Waiting:PreparingList",
                "TaskList !Waiting:ListReady",
                "TaskList !Waiting:FetchingTasks",
                "TaskList !Waiting:TasksFetched",
                "TaskList !Waiting:TasksCached",
                "TaskList !Waiting:SyncingThreadsToTasks",
                "TaskList !Waiting:ThreadsToTasksSynced",
                "TaskList !Waiting:SyncingTasksToThreads",
                "TaskList !Waiting:TasksToThreadsSynced",
                "TaskList !Waiting:SyncingCompletedThreads",
                "TaskList !Waiting:CompletedThreadsSynced",
                "TaskList !Waiting:SyncingCompletedTasks",
                "TaskList !Waiting:CompletedTasksSynced",
                "TaskList !Waiting:ThreadsFetched",
                "TaskList !Waiting:MsgsFetched"
            ],
            "z": 1,
            "is_touched": false
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Waiting:Exception",
            "parent": "TaskList--Waiting",
            "attrs": {
                "text": {
                    "text": "Exception"
                }
            },
            "z": 3,
            "size": {
                "width": 81,
                "height": 81
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Waiting:Enabled",
            "parent": "TaskList--Waiting",
            "attrs": {
                "text": {
                    "text": "Enabled"
                }
            },
            "z": 3,
            "size": {
                "width": 63,
                "height": 63
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Waiting:Syncing",
            "parent": "TaskList--Waiting",
            "attrs": {
                "text": {
                    "text": "Syncing"
                }
            },
            "z": 3,
            "size": {
                "width": 63,
                "height": 63
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Waiting:Synced",
            "parent": "TaskList--Waiting",
            "attrs": {
                "text": {
                    "text": "Synced"
                }
            },
            "z": 3,
            "size": {
                "width": 54,
                "height": 54
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Waiting:Restart",
            "parent": "TaskList--Waiting",
            "attrs": {
                "text": {
                    "text": "Restart"
                }
            },
            "z": 3,
            "size": {
                "width": 63,
                "height": 63
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Waiting:PreparingList",
            "parent": "TaskList--Waiting",
            "attrs": {
                "text": {
                    "text": "PreparingList"
                }
            },
            "z": 3,
            "size": {
                "width": 117,
                "height": 117
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Waiting:ListReady",
            "parent": "TaskList--Waiting",
            "attrs": {
                "text": {
                    "text": "ListReady"
                }
            },
            "z": 3,
            "size": {
                "width": 81,
                "height": 81
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Waiting:FetchingTasks",
            "parent": "TaskList--Waiting",
            "attrs": {
                "text": {
                    "text": "FetchingTasks"
                }
            },
            "z": 3,
            "size": {
                "width": 117,
                "height": 117
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Waiting:TasksFetched",
            "parent": "TaskList--Waiting",
            "attrs": {
                "text": {
                    "text": "TasksFetched"
                }
            },
            "z": 3,
            "size": {
                "width": 108,
                "height": 108
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Waiting:TasksCached",
            "parent": "TaskList--Waiting",
            "attrs": {
                "text": {
                    "text": "TasksCached"
                }
            },
            "z": 3,
            "size": {
                "width": 99,
                "height": 99
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Waiting:SyncingThreadsToTasks",
            "parent": "TaskList--Waiting",
            "attrs": {
                "text": {
                    "text": "SyncingThreadsToTasks"
                }
            },
            "z": 3,
            "size": {
                "width": 189,
                "height": 189
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Waiting:ThreadsToTasksSynced",
            "parent": "TaskList--Waiting",
            "attrs": {
                "text": {
                    "text": "ThreadsToTasksSynced"
                }
            },
            "z": 3,
            "size": {
                "width": 180,
                "height": 180
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Waiting:SyncingTasksToThreads",
            "parent": "TaskList--Waiting",
            "attrs": {
                "text": {
                    "text": "SyncingTasksToThreads"
                }
            },
            "z": 3,
            "size": {
                "width": 189,
                "height": 189
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Waiting:TasksToThreadsSynced",
            "parent": "TaskList--Waiting",
            "attrs": {
                "text": {
                    "text": "TasksToThreadsSynced"
                }
            },
            "z": 3,
            "size": {
                "width": 180,
                "height": 180
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Waiting:SyncingCompletedThreads",
            "parent": "TaskList--Waiting",
            "attrs": {
                "text": {
                    "text": "SyncingCompletedThreads"
                }
            },
            "z": 3,
            "size": {
                "width": 207,
                "height": 207
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Waiting:CompletedThreadsSynced",
            "parent": "TaskList--Waiting",
            "attrs": {
                "text": {
                    "text": "CompletedThreadsSynced"
                }
            },
            "z": 3,
            "size": {
                "width": 198,
                "height": 198
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Waiting:SyncingCompletedTasks",
            "parent": "TaskList--Waiting",
            "attrs": {
                "text": {
                    "text": "SyncingCompletedTasks"
                }
            },
            "z": 3,
            "size": {
                "width": 189,
                "height": 189
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Waiting:CompletedTasksSynced",
            "parent": "TaskList--Waiting",
            "attrs": {
                "text": {
                    "text": "CompletedTasksSynced"
                }
            },
            "z": 3,
            "size": {
                "width": 180,
                "height": 180
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Waiting:ThreadsFetched",
            "parent": "TaskList--Waiting",
            "attrs": {
                "text": {
                    "text": "ThreadsFetched"
                }
            },
            "z": 3,
            "size": {
                "width": 126,
                "height": 126
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Waiting:MsgsFetched",
            "parent": "TaskList--Waiting",
            "attrs": {
                "text": {
                    "text": "MsgsFetched"
                }
            },
            "z": 3,
            "size": {
                "width": 99,
                "height": 99
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "uml.State",
            "id": "GmailQuery---Waiting-",
            "name":  {"text": "GmailQuery '!Waiting'"},
            "embeds": [
                "GmailQuery '!Waiting':Exception",
                "GmailQuery '!Waiting':Enabled",
                "GmailQuery '!Waiting':Dirty",
                "GmailQuery '!Waiting':FetchingThreads",
                "GmailQuery '!Waiting':ThreadsFetched",
                "GmailQuery '!Waiting':FetchingMsgs",
                "GmailQuery '!Waiting':MsgsFetched"
            ],
            "z": 1,
            "is_touched": false
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery '!Waiting':Exception",
            "parent": "GmailQuery---Waiting-",
            "attrs": {
                "text": {
                    "text": "Exception"
                }
            },
            "z": 3,
            "size": {
                "width": 81,
                "height": 81
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery '!Waiting':Enabled",
            "parent": "GmailQuery---Waiting-",
            "attrs": {
                "text": {
                    "text": "Enabled"
                }
            },
            "z": 3,
            "size": {
                "width": 63,
                "height": 63
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery '!Waiting':Dirty",
            "parent": "GmailQuery---Waiting-",
            "attrs": {
                "text": {
                    "text": "Dirty"
                }
            },
            "z": 3,
            "size": {
                "width": 50,
                "height": 50
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery '!Waiting':FetchingThreads",
            "parent": "GmailQuery---Waiting-",
            "attrs": {
                "text": {
                    "text": "FetchingThreads"
                }
            },
            "z": 3,
            "size": {
                "width": 135,
                "height": 135
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery '!Waiting':ThreadsFetched",
            "parent": "GmailQuery---Waiting-",
            "attrs": {
                "text": {
                    "text": "ThreadsFetched"
                }
            },
            "z": 3,
            "size": {
                "width": 126,
                "height": 126
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery '!Waiting':FetchingMsgs",
            "parent": "GmailQuery---Waiting-",
            "attrs": {
                "text": {
                    "text": "FetchingMsgs"
                }
            },
            "z": 3,
            "size": {
                "width": 108,
                "height": 108
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery '!Waiting':MsgsFetched",
            "parent": "GmailQuery---Waiting-",
            "attrs": {
                "text": {
                    "text": "MsgsFetched"
                }
            },
            "z": 3,
            "size": {
                "width": 99,
                "height": 99
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "uml.State",
            "id": "TaskList--Someday",
            "name":  {"text": "TaskList !Someday"},
            "embeds": [
                "TaskList !Someday:Exception",
                "TaskList !Someday:Enabled",
                "TaskList !Someday:Syncing",
                "TaskList !Someday:Synced",
                "TaskList !Someday:Restart",
                "TaskList !Someday:PreparingList",
                "TaskList !Someday:ListReady",
                "TaskList !Someday:FetchingTasks",
                "TaskList !Someday:TasksFetched",
                "TaskList !Someday:TasksCached",
                "TaskList !Someday:SyncingThreadsToTasks",
                "TaskList !Someday:ThreadsToTasksSynced",
                "TaskList !Someday:SyncingTasksToThreads",
                "TaskList !Someday:TasksToThreadsSynced",
                "TaskList !Someday:SyncingCompletedThreads",
                "TaskList !Someday:CompletedThreadsSynced",
                "TaskList !Someday:SyncingCompletedTasks",
                "TaskList !Someday:CompletedTasksSynced",
                "TaskList !Someday:ThreadsFetched",
                "TaskList !Someday:MsgsFetched"
            ],
            "z": 1,
            "is_touched": false
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Someday:Exception",
            "parent": "TaskList--Someday",
            "attrs": {
                "text": {
                    "text": "Exception"
                }
            },
            "z": 3,
            "size": {
                "width": 81,
                "height": 81
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Someday:Enabled",
            "parent": "TaskList--Someday",
            "attrs": {
                "text": {
                    "text": "Enabled"
                }
            },
            "z": 3,
            "size": {
                "width": 63,
                "height": 63
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Someday:Syncing",
            "parent": "TaskList--Someday",
            "attrs": {
                "text": {
                    "text": "Syncing"
                }
            },
            "z": 3,
            "size": {
                "width": 63,
                "height": 63
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Someday:Synced",
            "parent": "TaskList--Someday",
            "attrs": {
                "text": {
                    "text": "Synced"
                }
            },
            "z": 3,
            "size": {
                "width": 54,
                "height": 54
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Someday:Restart",
            "parent": "TaskList--Someday",
            "attrs": {
                "text": {
                    "text": "Restart"
                }
            },
            "z": 3,
            "size": {
                "width": 63,
                "height": 63
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Someday:PreparingList",
            "parent": "TaskList--Someday",
            "attrs": {
                "text": {
                    "text": "PreparingList"
                }
            },
            "z": 3,
            "size": {
                "width": 117,
                "height": 117
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Someday:ListReady",
            "parent": "TaskList--Someday",
            "attrs": {
                "text": {
                    "text": "ListReady"
                }
            },
            "z": 3,
            "size": {
                "width": 81,
                "height": 81
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Someday:FetchingTasks",
            "parent": "TaskList--Someday",
            "attrs": {
                "text": {
                    "text": "FetchingTasks"
                }
            },
            "z": 3,
            "size": {
                "width": 117,
                "height": 117
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Someday:TasksFetched",
            "parent": "TaskList--Someday",
            "attrs": {
                "text": {
                    "text": "TasksFetched"
                }
            },
            "z": 3,
            "size": {
                "width": 108,
                "height": 108
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Someday:TasksCached",
            "parent": "TaskList--Someday",
            "attrs": {
                "text": {
                    "text": "TasksCached"
                }
            },
            "z": 3,
            "size": {
                "width": 99,
                "height": 99
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Someday:SyncingThreadsToTasks",
            "parent": "TaskList--Someday",
            "attrs": {
                "text": {
                    "text": "SyncingThreadsToTasks"
                }
            },
            "z": 3,
            "size": {
                "width": 189,
                "height": 189
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Someday:ThreadsToTasksSynced",
            "parent": "TaskList--Someday",
            "attrs": {
                "text": {
                    "text": "ThreadsToTasksSynced"
                }
            },
            "z": 3,
            "size": {
                "width": 180,
                "height": 180
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Someday:SyncingTasksToThreads",
            "parent": "TaskList--Someday",
            "attrs": {
                "text": {
                    "text": "SyncingTasksToThreads"
                }
            },
            "z": 3,
            "size": {
                "width": 189,
                "height": 189
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Someday:TasksToThreadsSynced",
            "parent": "TaskList--Someday",
            "attrs": {
                "text": {
                    "text": "TasksToThreadsSynced"
                }
            },
            "z": 3,
            "size": {
                "width": 180,
                "height": 180
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Someday:SyncingCompletedThreads",
            "parent": "TaskList--Someday",
            "attrs": {
                "text": {
                    "text": "SyncingCompletedThreads"
                }
            },
            "z": 3,
            "size": {
                "width": 207,
                "height": 207
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Someday:CompletedThreadsSynced",
            "parent": "TaskList--Someday",
            "attrs": {
                "text": {
                    "text": "CompletedThreadsSynced"
                }
            },
            "z": 3,
            "size": {
                "width": 198,
                "height": 198
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Someday:SyncingCompletedTasks",
            "parent": "TaskList--Someday",
            "attrs": {
                "text": {
                    "text": "SyncingCompletedTasks"
                }
            },
            "z": 3,
            "size": {
                "width": 189,
                "height": 189
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Someday:CompletedTasksSynced",
            "parent": "TaskList--Someday",
            "attrs": {
                "text": {
                    "text": "CompletedTasksSynced"
                }
            },
            "z": 3,
            "size": {
                "width": 180,
                "height": 180
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Someday:ThreadsFetched",
            "parent": "TaskList--Someday",
            "attrs": {
                "text": {
                    "text": "ThreadsFetched"
                }
            },
            "z": 3,
            "size": {
                "width": 126,
                "height": 126
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "TaskList !Someday:MsgsFetched",
            "parent": "TaskList--Someday",
            "attrs": {
                "text": {
                    "text": "MsgsFetched"
                }
            },
            "z": 3,
            "size": {
                "width": 99,
                "height": 99
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "uml.State",
            "id": "GmailQuery---Someday-",
            "name":  {"text": "GmailQuery '!Someday'"},
            "embeds": [
                "GmailQuery '!Someday':Exception",
                "GmailQuery '!Someday':Enabled",
                "GmailQuery '!Someday':Dirty",
                "GmailQuery '!Someday':FetchingThreads",
                "GmailQuery '!Someday':ThreadsFetched",
                "GmailQuery '!Someday':FetchingMsgs",
                "GmailQuery '!Someday':MsgsFetched"
            ],
            "z": 1,
            "is_touched": false
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery '!Someday':Exception",
            "parent": "GmailQuery---Someday-",
            "attrs": {
                "text": {
                    "text": "Exception"
                }
            },
            "z": 3,
            "size": {
                "width": 81,
                "height": 81
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery '!Someday':Enabled",
            "parent": "GmailQuery---Someday-",
            "attrs": {
                "text": {
                    "text": "Enabled"
                }
            },
            "z": 3,
            "size": {
                "width": 63,
                "height": 63
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery '!Someday':Dirty",
            "parent": "GmailQuery---Someday-",
            "attrs": {
                "text": {
                    "text": "Dirty"
                }
            },
            "z": 3,
            "size": {
                "width": 50,
                "height": 50
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery '!Someday':FetchingThreads",
            "parent": "GmailQuery---Someday-",
            "attrs": {
                "text": {
                    "text": "FetchingThreads"
                }
            },
            "z": 3,
            "size": {
                "width": 135,
                "height": 135
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery '!Someday':ThreadsFetched",
            "parent": "GmailQuery---Someday-",
            "attrs": {
                "text": {
                    "text": "ThreadsFetched"
                }
            },
            "z": 3,
            "size": {
                "width": 126,
                "height": 126
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery '!Someday':FetchingMsgs",
            "parent": "GmailQuery---Someday-",
            "attrs": {
                "text": {
                    "text": "FetchingMsgs"
                }
            },
            "z": 3,
            "size": {
                "width": 108,
                "height": 108
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.State",
            "id": "GmailQuery '!Someday':MsgsFetched",
            "parent": "GmailQuery---Someday-",
            "attrs": {
                "text": {
                    "text": "MsgsFetched"
                }
            },
            "z": 3,
            "size": {
                "width": 99,
                "height": 99
            },
            "is_set": false,
            "step_style": null
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "Sync:Authenticating"
            },
            "target": {
                "id": "Sync:Authenticated"
            },
            "id": "Sync:Authenticating-Sync:Authenticated-1",
            "labels": [
                {
                    "id": "Sync:Authenticating-Sync:Authenticated-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "Sync:Authenticating"
            },
            "target": {
                "id": "Sync:Enabled"
            },
            "id": "Sync:Authenticating-Sync:Enabled-0",
            "labels": [
                {
                    "id": "Sync:Authenticating-Sync:Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "Sync:Authenticated"
            },
            "target": {
                "id": "Sync:Authenticating"
            },
            "id": "Sync:Authenticated-Sync:Authenticating-1",
            "labels": [
                {
                    "id": "Sync:Authenticated-Sync:Authenticating-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "Sync:Syncing"
            },
            "target": {
                "id": "Sync:Synced"
            },
            "id": "Sync:Syncing-Sync:Synced-1",
            "labels": [
                {
                    "id": "Sync:Syncing-Sync:Synced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "Sync:Syncing"
            },
            "target": {
                "id": "Sync:Enabled"
            },
            "id": "Sync:Syncing-Sync:Enabled-0",
            "labels": [
                {
                    "id": "Sync:Syncing-Sync:Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "Sync:Syncing"
            },
            "target": {
                "id": "Sync:Authenticated"
            },
            "id": "Sync:Syncing-Sync:Authenticated-0",
            "labels": [
                {
                    "id": "Sync:Syncing-Sync:Authenticated-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "Sync:Synced"
            },
            "target": {
                "id": "Sync:Syncing"
            },
            "id": "Sync:Synced-Sync:Syncing-1",
            "labels": [
                {
                    "id": "Sync:Synced-Sync:Syncing-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "Sync:Synced"
            },
            "target": {
                "id": "Sync:Enabled"
            },
            "id": "Sync:Synced-Sync:Enabled-0",
            "labels": [
                {
                    "id": "Sync:Synced-Sync:Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "Sync:Synced"
            },
            "target": {
                "id": "Sync:Authenticated"
            },
            "id": "Sync:Synced-Sync:Authenticated-0",
            "labels": [
                {
                    "id": "Sync:Synced-Sync:Authenticated-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "Sync:Synced"
            },
            "target": {
                "id": "Sync:TaskListsSynced"
            },
            "id": "Sync:Synced-Sync:TaskListsSynced-0",
            "labels": [
                {
                    "id": "Sync:Synced-Sync:TaskListsSynced-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "Sync:Synced"
            },
            "target": {
                "id": "Sync:QueryLabelsSynced"
            },
            "id": "Sync:Synced-Sync:QueryLabelsSynced-0",
            "labels": [
                {
                    "id": "Sync:Synced-Sync:QueryLabelsSynced-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "Sync:TaskListSyncEnabled"
            },
            "target": {
                "id": "Sync:TaskListsFetched"
            },
            "id": "Sync:TaskListSyncEnabled-Sync:TaskListsFetched-0",
            "labels": [
                {
                    "id": "Sync:TaskListSyncEnabled-Sync:TaskListsFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "Sync:TaskListSyncEnabled"
            },
            "target": {
                "id": "Sync:QueryLabelsSynced"
            },
            "id": "Sync:TaskListSyncEnabled-Sync:QueryLabelsSynced-0",
            "labels": [
                {
                    "id": "Sync:TaskListSyncEnabled-Sync:QueryLabelsSynced-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "Sync:TaskListSyncEnabled"
            },
            "target": {
                "id": "TaskList !Inbox:Enabled"
            },
            "id": "Sync:TaskListSyncEnabled-TaskList !Inbox:Enabled-undefined",
            "labels": [
                {
                    "id": "Sync:TaskListSyncEnabled-TaskList !Inbox:Enabled-undefined-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {}
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "Sync:TaskListSyncEnabled"
            },
            "target": {
                "id": "TaskList !Next:Enabled"
            },
            "id": "Sync:TaskListSyncEnabled-TaskList !Next:Enabled-undefined",
            "labels": [
                {
                    "id": "Sync:TaskListSyncEnabled-TaskList !Next:Enabled-undefined-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {}
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "Sync:TaskListSyncEnabled"
            },
            "target": {
                "id": "TaskList !Actions:Enabled"
            },
            "id": "Sync:TaskListSyncEnabled-TaskList !Actions:Enabled-undefined",
            "labels": [
                {
                    "id": "Sync:TaskListSyncEnabled-TaskList !Actions:Enabled-undefined-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {}
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "Sync:TaskListSyncEnabled"
            },
            "target": {
                "id": "TaskList !Waiting:Enabled"
            },
            "id": "Sync:TaskListSyncEnabled-TaskList !Waiting:Enabled-undefined",
            "labels": [
                {
                    "id": "Sync:TaskListSyncEnabled-TaskList !Waiting:Enabled-undefined-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {}
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "Sync:TaskListSyncEnabled"
            },
            "target": {
                "id": "TaskList !Someday:Enabled"
            },
            "id": "Sync:TaskListSyncEnabled-TaskList !Someday:Enabled-undefined",
            "labels": [
                {
                    "id": "Sync:TaskListSyncEnabled-TaskList !Someday:Enabled-undefined-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {}
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "Sync:FetchingTaskLists"
            },
            "target": {
                "id": "Sync:TaskListsFetched"
            },
            "id": "Sync:FetchingTaskLists-Sync:TaskListsFetched-1",
            "labels": [
                {
                    "id": "Sync:FetchingTaskLists-Sync:TaskListsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "Sync:FetchingTaskLists"
            },
            "target": {
                "id": "Sync:Enabled"
            },
            "id": "Sync:FetchingTaskLists-Sync:Enabled-0",
            "labels": [
                {
                    "id": "Sync:FetchingTaskLists-Sync:Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "Sync:TaskListsFetched"
            },
            "target": {
                "id": "Sync:FetchingTaskLists"
            },
            "id": "Sync:TaskListsFetched-Sync:FetchingTaskLists-1",
            "labels": [
                {
                    "id": "Sync:TaskListsFetched-Sync:FetchingTaskLists-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "Auth:Ready"
            },
            "target": {
                "id": "Auth:TokenRefreshed"
            },
            "id": "Auth:Ready-Auth:TokenRefreshed-0",
            "labels": [
                {
                    "id": "Auth:Ready-Auth:TokenRefreshed-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "Auth:Ready"
            },
            "target": {
                "id": "Sync:Authenticated"
            },
            "id": "Auth:Ready-Sync:Authenticated-4",
            "labels": [
                {
                    "id": "Auth:Ready-Sync:Authenticated-4-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "add"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "Auth:RefreshingToken"
            },
            "target": {
                "id": "Auth:TokenRefreshed"
            },
            "id": "Auth:RefreshingToken-Auth:TokenRefreshed-1",
            "labels": [
                {
                    "id": "Auth:RefreshingToken-Auth:TokenRefreshed-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "Auth:RefreshingToken"
            },
            "target": {
                "id": "Auth:CredentialsSet"
            },
            "id": "Auth:RefreshingToken-Auth:CredentialsSet-0",
            "labels": [
                {
                    "id": "Auth:RefreshingToken-Auth:CredentialsSet-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "Auth:TokenRefreshed"
            },
            "target": {
                "id": "Auth:RefreshingToken"
            },
            "id": "Auth:TokenRefreshed-Auth:RefreshingToken-1",
            "labels": [
                {
                    "id": "Auth:TokenRefreshed-Auth:RefreshingToken-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "Auth:TokenRefreshed"
            },
            "target": {
                "id": "Auth:CredentialsSet"
            },
            "id": "Auth:TokenRefreshed-Auth:CredentialsSet-0",
            "labels": [
                {
                    "id": "Auth:TokenRefreshed-Auth:CredentialsSet-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "Gmail:Dirty"
            },
            "target": {
                "id": "Gmail:QueryLabelsSynced"
            },
            "id": "Gmail:Dirty-Gmail:QueryLabelsSynced-1",
            "labels": [
                {
                    "id": "Gmail:Dirty-Gmail:QueryLabelsSynced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "Gmail:Dirty"
            },
            "target": {
                "id": "Gmail:SyncingQueryLabels"
            },
            "id": "Gmail:Dirty-Gmail:SyncingQueryLabels-1",
            "labels": [
                {
                    "id": "Gmail:Dirty-Gmail:SyncingQueryLabels-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "Gmail:SyncingQueryLabels"
            },
            "target": {
                "id": "Gmail:QueryLabelsSynced"
            },
            "id": "Gmail:SyncingQueryLabels-Gmail:QueryLabelsSynced-1",
            "labels": [
                {
                    "id": "Gmail:SyncingQueryLabels-Gmail:QueryLabelsSynced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "Gmail:SyncingQueryLabels"
            },
            "target": {
                "id": "Gmail:SyncingEnabled"
            },
            "id": "Gmail:SyncingQueryLabels-Gmail:SyncingEnabled-0",
            "labels": [
                {
                    "id": "Gmail:SyncingQueryLabels-Gmail:SyncingEnabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "Gmail:SyncingQueryLabels"
            },
            "target": {
                "id": "Gmail:LabelsFetched"
            },
            "id": "Gmail:SyncingQueryLabels-Gmail:LabelsFetched-0",
            "labels": [
                {
                    "id": "Gmail:SyncingQueryLabels-Gmail:LabelsFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "Gmail:QueryLabelsSynced"
            },
            "target": {
                "id": "Gmail:SyncingQueryLabels"
            },
            "id": "Gmail:QueryLabelsSynced-Gmail:SyncingQueryLabels-1",
            "labels": [
                {
                    "id": "Gmail:QueryLabelsSynced-Gmail:SyncingQueryLabels-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "Gmail:QueryLabelsSynced"
            },
            "target": {
                "id": "Sync:QueryLabelsSynced"
            },
            "id": "Gmail:QueryLabelsSynced-Sync:QueryLabelsSynced-4",
            "labels": [
                {
                    "id": "Gmail:QueryLabelsSynced-Sync:QueryLabelsSynced-4-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "add"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "Gmail:FetchingLabels"
            },
            "target": {
                "id": "Gmail:LabelsFetched"
            },
            "id": "Gmail:FetchingLabels-Gmail:LabelsFetched-1",
            "labels": [
                {
                    "id": "Gmail:FetchingLabels-Gmail:LabelsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "Gmail:FetchingLabels"
            },
            "target": {
                "id": "Gmail:Enabled"
            },
            "id": "Gmail:FetchingLabels-Gmail:Enabled-0",
            "labels": [
                {
                    "id": "Gmail:FetchingLabels-Gmail:Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "Gmail:LabelsFetched"
            },
            "target": {
                "id": "Gmail:FetchingLabels"
            },
            "id": "Gmail:LabelsFetched-Gmail:FetchingLabels-1",
            "labels": [
                {
                    "id": "Gmail:LabelsFetched-Gmail:FetchingLabels-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "Gmail:FetchingHistoryId"
            },
            "target": {
                "id": "Gmail:HistoryIdFetched"
            },
            "id": "Gmail:FetchingHistoryId-Gmail:HistoryIdFetched-1",
            "labels": [
                {
                    "id": "Gmail:FetchingHistoryId-Gmail:HistoryIdFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "Gmail:FetchingHistoryId"
            },
            "target": {
                "id": "Gmail:Enabled"
            },
            "id": "Gmail:FetchingHistoryId-Gmail:Enabled-0",
            "labels": [
                {
                    "id": "Gmail:FetchingHistoryId-Gmail:Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "Gmail:HistoryIdFetched"
            },
            "target": {
                "id": "Gmail:FetchingHistoryId"
            },
            "id": "Gmail:HistoryIdFetched-Gmail:FetchingHistoryId-1",
            "labels": [
                {
                    "id": "Gmail:HistoryIdFetched-Gmail:FetchingHistoryId-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 1':Dirty"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 1':MsgsFetched"
            },
            "id": "GmailQuery 'QueryLabels 1':Dirty-GmailQuery 'QueryLabels 1':MsgsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 1':Dirty-GmailQuery 'QueryLabels 1':MsgsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 1':Dirty"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 1':ThreadsFetched"
            },
            "id": "GmailQuery 'QueryLabels 1':Dirty-GmailQuery 'QueryLabels 1':ThreadsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 1':Dirty-GmailQuery 'QueryLabels 1':ThreadsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 1':FetchingThreads"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 1':ThreadsFetched"
            },
            "id": "GmailQuery 'QueryLabels 1':FetchingThreads-GmailQuery 'QueryLabels 1':ThreadsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 1':FetchingThreads-GmailQuery 'QueryLabels 1':ThreadsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 1':FetchingThreads"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 1':Enabled"
            },
            "id": "GmailQuery 'QueryLabels 1':FetchingThreads-GmailQuery 'QueryLabels 1':Enabled-0",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 1':FetchingThreads-GmailQuery 'QueryLabels 1':Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 1':ThreadsFetched"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 1':FetchingThreads"
            },
            "id": "GmailQuery 'QueryLabels 1':ThreadsFetched-GmailQuery 'QueryLabels 1':FetchingThreads-1",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 1':ThreadsFetched-GmailQuery 'QueryLabels 1':FetchingThreads-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 1':ThreadsFetched"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 1':Enabled"
            },
            "id": "GmailQuery 'QueryLabels 1':ThreadsFetched-GmailQuery 'QueryLabels 1':Enabled-0",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 1':ThreadsFetched-GmailQuery 'QueryLabels 1':Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 1':FetchingMsgs"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 1':MsgsFetched"
            },
            "id": "GmailQuery 'QueryLabels 1':FetchingMsgs-GmailQuery 'QueryLabels 1':MsgsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 1':FetchingMsgs-GmailQuery 'QueryLabels 1':MsgsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 1':FetchingMsgs"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 1':Enabled"
            },
            "id": "GmailQuery 'QueryLabels 1':FetchingMsgs-GmailQuery 'QueryLabels 1':Enabled-0",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 1':FetchingMsgs-GmailQuery 'QueryLabels 1':Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 1':FetchingMsgs"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 1':ThreadsFetched"
            },
            "id": "GmailQuery 'QueryLabels 1':FetchingMsgs-GmailQuery 'QueryLabels 1':ThreadsFetched-0",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 1':FetchingMsgs-GmailQuery 'QueryLabels 1':ThreadsFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 1':MsgsFetched"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 1':FetchingMsgs"
            },
            "id": "GmailQuery 'QueryLabels 1':MsgsFetched-GmailQuery 'QueryLabels 1':FetchingMsgs-1",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 1':MsgsFetched-GmailQuery 'QueryLabels 1':FetchingMsgs-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 2':Dirty"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 2':MsgsFetched"
            },
            "id": "GmailQuery 'QueryLabels 2':Dirty-GmailQuery 'QueryLabels 2':MsgsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 2':Dirty-GmailQuery 'QueryLabels 2':MsgsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 2':Dirty"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 2':ThreadsFetched"
            },
            "id": "GmailQuery 'QueryLabels 2':Dirty-GmailQuery 'QueryLabels 2':ThreadsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 2':Dirty-GmailQuery 'QueryLabels 2':ThreadsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 2':FetchingThreads"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 2':ThreadsFetched"
            },
            "id": "GmailQuery 'QueryLabels 2':FetchingThreads-GmailQuery 'QueryLabels 2':ThreadsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 2':FetchingThreads-GmailQuery 'QueryLabels 2':ThreadsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 2':FetchingThreads"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 2':Enabled"
            },
            "id": "GmailQuery 'QueryLabels 2':FetchingThreads-GmailQuery 'QueryLabels 2':Enabled-0",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 2':FetchingThreads-GmailQuery 'QueryLabels 2':Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 2':ThreadsFetched"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 2':FetchingThreads"
            },
            "id": "GmailQuery 'QueryLabels 2':ThreadsFetched-GmailQuery 'QueryLabels 2':FetchingThreads-1",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 2':ThreadsFetched-GmailQuery 'QueryLabels 2':FetchingThreads-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 2':ThreadsFetched"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 2':Enabled"
            },
            "id": "GmailQuery 'QueryLabels 2':ThreadsFetched-GmailQuery 'QueryLabels 2':Enabled-0",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 2':ThreadsFetched-GmailQuery 'QueryLabels 2':Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 2':FetchingMsgs"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 2':MsgsFetched"
            },
            "id": "GmailQuery 'QueryLabels 2':FetchingMsgs-GmailQuery 'QueryLabels 2':MsgsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 2':FetchingMsgs-GmailQuery 'QueryLabels 2':MsgsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 2':FetchingMsgs"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 2':Enabled"
            },
            "id": "GmailQuery 'QueryLabels 2':FetchingMsgs-GmailQuery 'QueryLabels 2':Enabled-0",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 2':FetchingMsgs-GmailQuery 'QueryLabels 2':Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 2':FetchingMsgs"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 2':ThreadsFetched"
            },
            "id": "GmailQuery 'QueryLabels 2':FetchingMsgs-GmailQuery 'QueryLabels 2':ThreadsFetched-0",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 2':FetchingMsgs-GmailQuery 'QueryLabels 2':ThreadsFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 2':MsgsFetched"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 2':FetchingMsgs"
            },
            "id": "GmailQuery 'QueryLabels 2':MsgsFetched-GmailQuery 'QueryLabels 2':FetchingMsgs-1",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 2':MsgsFetched-GmailQuery 'QueryLabels 2':FetchingMsgs-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 3':Dirty"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 3':MsgsFetched"
            },
            "id": "GmailQuery 'QueryLabels 3':Dirty-GmailQuery 'QueryLabels 3':MsgsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 3':Dirty-GmailQuery 'QueryLabels 3':MsgsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 3':Dirty"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 3':ThreadsFetched"
            },
            "id": "GmailQuery 'QueryLabels 3':Dirty-GmailQuery 'QueryLabels 3':ThreadsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 3':Dirty-GmailQuery 'QueryLabels 3':ThreadsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 3':FetchingThreads"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 3':ThreadsFetched"
            },
            "id": "GmailQuery 'QueryLabels 3':FetchingThreads-GmailQuery 'QueryLabels 3':ThreadsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 3':FetchingThreads-GmailQuery 'QueryLabels 3':ThreadsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 3':FetchingThreads"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 3':Enabled"
            },
            "id": "GmailQuery 'QueryLabels 3':FetchingThreads-GmailQuery 'QueryLabels 3':Enabled-0",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 3':FetchingThreads-GmailQuery 'QueryLabels 3':Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 3':ThreadsFetched"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 3':FetchingThreads"
            },
            "id": "GmailQuery 'QueryLabels 3':ThreadsFetched-GmailQuery 'QueryLabels 3':FetchingThreads-1",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 3':ThreadsFetched-GmailQuery 'QueryLabels 3':FetchingThreads-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 3':ThreadsFetched"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 3':Enabled"
            },
            "id": "GmailQuery 'QueryLabels 3':ThreadsFetched-GmailQuery 'QueryLabels 3':Enabled-0",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 3':ThreadsFetched-GmailQuery 'QueryLabels 3':Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 3':FetchingMsgs"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 3':MsgsFetched"
            },
            "id": "GmailQuery 'QueryLabels 3':FetchingMsgs-GmailQuery 'QueryLabels 3':MsgsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 3':FetchingMsgs-GmailQuery 'QueryLabels 3':MsgsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 3':FetchingMsgs"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 3':Enabled"
            },
            "id": "GmailQuery 'QueryLabels 3':FetchingMsgs-GmailQuery 'QueryLabels 3':Enabled-0",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 3':FetchingMsgs-GmailQuery 'QueryLabels 3':Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 3':FetchingMsgs"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 3':ThreadsFetched"
            },
            "id": "GmailQuery 'QueryLabels 3':FetchingMsgs-GmailQuery 'QueryLabels 3':ThreadsFetched-0",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 3':FetchingMsgs-GmailQuery 'QueryLabels 3':ThreadsFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 3':MsgsFetched"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 3':FetchingMsgs"
            },
            "id": "GmailQuery 'QueryLabels 3':MsgsFetched-GmailQuery 'QueryLabels 3':FetchingMsgs-1",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 3':MsgsFetched-GmailQuery 'QueryLabels 3':FetchingMsgs-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 4':Dirty"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 4':MsgsFetched"
            },
            "id": "GmailQuery 'QueryLabels 4':Dirty-GmailQuery 'QueryLabels 4':MsgsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 4':Dirty-GmailQuery 'QueryLabels 4':MsgsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 4':Dirty"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 4':ThreadsFetched"
            },
            "id": "GmailQuery 'QueryLabels 4':Dirty-GmailQuery 'QueryLabels 4':ThreadsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 4':Dirty-GmailQuery 'QueryLabels 4':ThreadsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 4':FetchingThreads"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 4':ThreadsFetched"
            },
            "id": "GmailQuery 'QueryLabels 4':FetchingThreads-GmailQuery 'QueryLabels 4':ThreadsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 4':FetchingThreads-GmailQuery 'QueryLabels 4':ThreadsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 4':FetchingThreads"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 4':Enabled"
            },
            "id": "GmailQuery 'QueryLabels 4':FetchingThreads-GmailQuery 'QueryLabels 4':Enabled-0",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 4':FetchingThreads-GmailQuery 'QueryLabels 4':Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 4':ThreadsFetched"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 4':FetchingThreads"
            },
            "id": "GmailQuery 'QueryLabels 4':ThreadsFetched-GmailQuery 'QueryLabels 4':FetchingThreads-1",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 4':ThreadsFetched-GmailQuery 'QueryLabels 4':FetchingThreads-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 4':ThreadsFetched"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 4':Enabled"
            },
            "id": "GmailQuery 'QueryLabels 4':ThreadsFetched-GmailQuery 'QueryLabels 4':Enabled-0",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 4':ThreadsFetched-GmailQuery 'QueryLabels 4':Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 4':FetchingMsgs"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 4':MsgsFetched"
            },
            "id": "GmailQuery 'QueryLabels 4':FetchingMsgs-GmailQuery 'QueryLabels 4':MsgsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 4':FetchingMsgs-GmailQuery 'QueryLabels 4':MsgsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 4':FetchingMsgs"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 4':Enabled"
            },
            "id": "GmailQuery 'QueryLabels 4':FetchingMsgs-GmailQuery 'QueryLabels 4':Enabled-0",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 4':FetchingMsgs-GmailQuery 'QueryLabels 4':Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 4':FetchingMsgs"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 4':ThreadsFetched"
            },
            "id": "GmailQuery 'QueryLabels 4':FetchingMsgs-GmailQuery 'QueryLabels 4':ThreadsFetched-0",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 4':FetchingMsgs-GmailQuery 'QueryLabels 4':ThreadsFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 4':MsgsFetched"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 4':FetchingMsgs"
            },
            "id": "GmailQuery 'QueryLabels 4':MsgsFetched-GmailQuery 'QueryLabels 4':FetchingMsgs-1",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 4':MsgsFetched-GmailQuery 'QueryLabels 4':FetchingMsgs-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 5':Dirty"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 5':MsgsFetched"
            },
            "id": "GmailQuery 'QueryLabels 5':Dirty-GmailQuery 'QueryLabels 5':MsgsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 5':Dirty-GmailQuery 'QueryLabels 5':MsgsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 5':Dirty"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 5':ThreadsFetched"
            },
            "id": "GmailQuery 'QueryLabels 5':Dirty-GmailQuery 'QueryLabels 5':ThreadsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 5':Dirty-GmailQuery 'QueryLabels 5':ThreadsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 5':FetchingThreads"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 5':ThreadsFetched"
            },
            "id": "GmailQuery 'QueryLabels 5':FetchingThreads-GmailQuery 'QueryLabels 5':ThreadsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 5':FetchingThreads-GmailQuery 'QueryLabels 5':ThreadsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 5':FetchingThreads"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 5':Enabled"
            },
            "id": "GmailQuery 'QueryLabels 5':FetchingThreads-GmailQuery 'QueryLabels 5':Enabled-0",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 5':FetchingThreads-GmailQuery 'QueryLabels 5':Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 5':ThreadsFetched"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 5':FetchingThreads"
            },
            "id": "GmailQuery 'QueryLabels 5':ThreadsFetched-GmailQuery 'QueryLabels 5':FetchingThreads-1",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 5':ThreadsFetched-GmailQuery 'QueryLabels 5':FetchingThreads-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 5':ThreadsFetched"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 5':Enabled"
            },
            "id": "GmailQuery 'QueryLabels 5':ThreadsFetched-GmailQuery 'QueryLabels 5':Enabled-0",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 5':ThreadsFetched-GmailQuery 'QueryLabels 5':Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 5':FetchingMsgs"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 5':MsgsFetched"
            },
            "id": "GmailQuery 'QueryLabels 5':FetchingMsgs-GmailQuery 'QueryLabels 5':MsgsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 5':FetchingMsgs-GmailQuery 'QueryLabels 5':MsgsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 5':FetchingMsgs"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 5':Enabled"
            },
            "id": "GmailQuery 'QueryLabels 5':FetchingMsgs-GmailQuery 'QueryLabels 5':Enabled-0",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 5':FetchingMsgs-GmailQuery 'QueryLabels 5':Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 5':FetchingMsgs"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 5':ThreadsFetched"
            },
            "id": "GmailQuery 'QueryLabels 5':FetchingMsgs-GmailQuery 'QueryLabels 5':ThreadsFetched-0",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 5':FetchingMsgs-GmailQuery 'QueryLabels 5':ThreadsFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 5':MsgsFetched"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 5':FetchingMsgs"
            },
            "id": "GmailQuery 'QueryLabels 5':MsgsFetched-GmailQuery 'QueryLabels 5':FetchingMsgs-1",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 5':MsgsFetched-GmailQuery 'QueryLabels 5':FetchingMsgs-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 6':Dirty"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 6':MsgsFetched"
            },
            "id": "GmailQuery 'QueryLabels 6':Dirty-GmailQuery 'QueryLabels 6':MsgsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 6':Dirty-GmailQuery 'QueryLabels 6':MsgsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 6':Dirty"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 6':ThreadsFetched"
            },
            "id": "GmailQuery 'QueryLabels 6':Dirty-GmailQuery 'QueryLabels 6':ThreadsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 6':Dirty-GmailQuery 'QueryLabels 6':ThreadsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 6':FetchingThreads"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 6':ThreadsFetched"
            },
            "id": "GmailQuery 'QueryLabels 6':FetchingThreads-GmailQuery 'QueryLabels 6':ThreadsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 6':FetchingThreads-GmailQuery 'QueryLabels 6':ThreadsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 6':FetchingThreads"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 6':Enabled"
            },
            "id": "GmailQuery 'QueryLabels 6':FetchingThreads-GmailQuery 'QueryLabels 6':Enabled-0",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 6':FetchingThreads-GmailQuery 'QueryLabels 6':Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 6':ThreadsFetched"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 6':FetchingThreads"
            },
            "id": "GmailQuery 'QueryLabels 6':ThreadsFetched-GmailQuery 'QueryLabels 6':FetchingThreads-1",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 6':ThreadsFetched-GmailQuery 'QueryLabels 6':FetchingThreads-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 6':ThreadsFetched"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 6':Enabled"
            },
            "id": "GmailQuery 'QueryLabels 6':ThreadsFetched-GmailQuery 'QueryLabels 6':Enabled-0",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 6':ThreadsFetched-GmailQuery 'QueryLabels 6':Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 6':FetchingMsgs"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 6':MsgsFetched"
            },
            "id": "GmailQuery 'QueryLabels 6':FetchingMsgs-GmailQuery 'QueryLabels 6':MsgsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 6':FetchingMsgs-GmailQuery 'QueryLabels 6':MsgsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 6':FetchingMsgs"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 6':Enabled"
            },
            "id": "GmailQuery 'QueryLabels 6':FetchingMsgs-GmailQuery 'QueryLabels 6':Enabled-0",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 6':FetchingMsgs-GmailQuery 'QueryLabels 6':Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 6':FetchingMsgs"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 6':ThreadsFetched"
            },
            "id": "GmailQuery 'QueryLabels 6':FetchingMsgs-GmailQuery 'QueryLabels 6':ThreadsFetched-0",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 6':FetchingMsgs-GmailQuery 'QueryLabels 6':ThreadsFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 6':MsgsFetched"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 6':FetchingMsgs"
            },
            "id": "GmailQuery 'QueryLabels 6':MsgsFetched-GmailQuery 'QueryLabels 6':FetchingMsgs-1",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 6':MsgsFetched-GmailQuery 'QueryLabels 6':FetchingMsgs-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 7':Dirty"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 7':MsgsFetched"
            },
            "id": "GmailQuery 'QueryLabels 7':Dirty-GmailQuery 'QueryLabels 7':MsgsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 7':Dirty-GmailQuery 'QueryLabels 7':MsgsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 7':Dirty"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 7':ThreadsFetched"
            },
            "id": "GmailQuery 'QueryLabels 7':Dirty-GmailQuery 'QueryLabels 7':ThreadsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 7':Dirty-GmailQuery 'QueryLabels 7':ThreadsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 7':FetchingThreads"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 7':ThreadsFetched"
            },
            "id": "GmailQuery 'QueryLabels 7':FetchingThreads-GmailQuery 'QueryLabels 7':ThreadsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 7':FetchingThreads-GmailQuery 'QueryLabels 7':ThreadsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 7':FetchingThreads"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 7':Enabled"
            },
            "id": "GmailQuery 'QueryLabels 7':FetchingThreads-GmailQuery 'QueryLabels 7':Enabled-0",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 7':FetchingThreads-GmailQuery 'QueryLabels 7':Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 7':ThreadsFetched"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 7':FetchingThreads"
            },
            "id": "GmailQuery 'QueryLabels 7':ThreadsFetched-GmailQuery 'QueryLabels 7':FetchingThreads-1",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 7':ThreadsFetched-GmailQuery 'QueryLabels 7':FetchingThreads-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 7':ThreadsFetched"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 7':Enabled"
            },
            "id": "GmailQuery 'QueryLabels 7':ThreadsFetched-GmailQuery 'QueryLabels 7':Enabled-0",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 7':ThreadsFetched-GmailQuery 'QueryLabels 7':Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 7':FetchingMsgs"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 7':MsgsFetched"
            },
            "id": "GmailQuery 'QueryLabels 7':FetchingMsgs-GmailQuery 'QueryLabels 7':MsgsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 7':FetchingMsgs-GmailQuery 'QueryLabels 7':MsgsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 7':FetchingMsgs"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 7':Enabled"
            },
            "id": "GmailQuery 'QueryLabels 7':FetchingMsgs-GmailQuery 'QueryLabels 7':Enabled-0",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 7':FetchingMsgs-GmailQuery 'QueryLabels 7':Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 7':FetchingMsgs"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 7':ThreadsFetched"
            },
            "id": "GmailQuery 'QueryLabels 7':FetchingMsgs-GmailQuery 'QueryLabels 7':ThreadsFetched-0",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 7':FetchingMsgs-GmailQuery 'QueryLabels 7':ThreadsFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery 'QueryLabels 7':MsgsFetched"
            },
            "target": {
                "id": "GmailQuery 'QueryLabels 7':FetchingMsgs"
            },
            "id": "GmailQuery 'QueryLabels 7':MsgsFetched-GmailQuery 'QueryLabels 7':FetchingMsgs-1",
            "labels": [
                {
                    "id": "GmailQuery 'QueryLabels 7':MsgsFetched-GmailQuery 'QueryLabels 7':FetchingMsgs-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "Sync:GmailEnabled"
            },
            "target": {
                "id": "Gmail:Enabled"
            },
            "id": "Sync:GmailEnabled-Gmail:Enabled-4",
            "labels": [
                {
                    "id": "Sync:GmailEnabled-Gmail:Enabled-4-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "add"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "Sync:GmailSyncEnabled"
            },
            "target": {
                "id": "Gmail:SyncingEnabled"
            },
            "id": "Sync:GmailSyncEnabled-Gmail:SyncingEnabled-4",
            "labels": [
                {
                    "id": "Sync:GmailSyncEnabled-Gmail:SyncingEnabled-4-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "add"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Inbox:Syncing"
            },
            "target": {
                "id": "TaskList !Inbox:Synced"
            },
            "id": "TaskList !Inbox:Syncing-TaskList !Inbox:Synced-1",
            "labels": [
                {
                    "id": "TaskList !Inbox:Syncing-TaskList !Inbox:Synced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Inbox:Syncing"
            },
            "target": {
                "id": "TaskList !Inbox:Restart"
            },
            "id": "TaskList !Inbox:Syncing-TaskList !Inbox:Restart-1",
            "labels": [
                {
                    "id": "TaskList !Inbox:Syncing-TaskList !Inbox:Restart-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Inbox:Syncing"
            },
            "target": {
                "id": "TaskList !Inbox:Enabled"
            },
            "id": "TaskList !Inbox:Syncing-TaskList !Inbox:Enabled-0",
            "labels": [
                {
                    "id": "TaskList !Inbox:Syncing-TaskList !Inbox:Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Inbox:Syncing"
            },
            "target": {
                "id": "Sync:SyncingTaskLists"
            },
            "id": "TaskList !Inbox:Syncing-Sync:SyncingTaskLists-4",
            "labels": [
                {
                    "id": "TaskList !Inbox:Syncing-Sync:SyncingTaskLists-4-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "add"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Inbox:Synced"
            },
            "target": {
                "id": "TaskList !Inbox:Syncing"
            },
            "id": "TaskList !Inbox:Synced-TaskList !Inbox:Syncing-1",
            "labels": [
                {
                    "id": "TaskList !Inbox:Synced-TaskList !Inbox:Syncing-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Inbox:Synced"
            },
            "target": {
                "id": "TaskList !Inbox:CompletedTasksSynced"
            },
            "id": "TaskList !Inbox:Synced-TaskList !Inbox:CompletedTasksSynced-0",
            "labels": [
                {
                    "id": "TaskList !Inbox:Synced-TaskList !Inbox:CompletedTasksSynced-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Inbox:Synced"
            },
            "target": {
                "id": "TaskList !Inbox:ThreadsToTasksSynced"
            },
            "id": "TaskList !Inbox:Synced-TaskList !Inbox:ThreadsToTasksSynced-0",
            "labels": [
                {
                    "id": "TaskList !Inbox:Synced-TaskList !Inbox:ThreadsToTasksSynced-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Inbox:Synced"
            },
            "target": {
                "id": "TaskList !Inbox:TasksToThreadsSynced"
            },
            "id": "TaskList !Inbox:Synced-TaskList !Inbox:TasksToThreadsSynced-0",
            "labels": [
                {
                    "id": "TaskList !Inbox:Synced-TaskList !Inbox:TasksToThreadsSynced-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Inbox:Synced"
            },
            "target": {
                "id": "TaskList !Inbox:CompletedThreadsSynced"
            },
            "id": "TaskList !Inbox:Synced-TaskList !Inbox:CompletedThreadsSynced-0",
            "labels": [
                {
                    "id": "TaskList !Inbox:Synced-TaskList !Inbox:CompletedThreadsSynced-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Inbox:Synced"
            },
            "target": {
                "id": "Sync:TaskListsSynced"
            },
            "id": "TaskList !Inbox:Synced-Sync:TaskListsSynced-4",
            "labels": [
                {
                    "id": "TaskList !Inbox:Synced-Sync:TaskListsSynced-4-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "add"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Inbox:Restart"
            },
            "target": {
                "id": "TaskList !Inbox:TasksFetched"
            },
            "id": "TaskList !Inbox:Restart-TaskList !Inbox:TasksFetched-1",
            "labels": [
                {
                    "id": "TaskList !Inbox:Restart-TaskList !Inbox:TasksFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Inbox:Restart"
            },
            "target": {
                "id": "TaskList !Inbox:CompletedTasksSynced"
            },
            "id": "TaskList !Inbox:Restart-TaskList !Inbox:CompletedTasksSynced-1",
            "labels": [
                {
                    "id": "TaskList !Inbox:Restart-TaskList !Inbox:CompletedTasksSynced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Inbox:Restart"
            },
            "target": {
                "id": "TaskList !Inbox:ThreadsToTasksSynced"
            },
            "id": "TaskList !Inbox:Restart-TaskList !Inbox:ThreadsToTasksSynced-1",
            "labels": [
                {
                    "id": "TaskList !Inbox:Restart-TaskList !Inbox:ThreadsToTasksSynced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Inbox:Restart"
            },
            "target": {
                "id": "TaskList !Inbox:TasksToThreadsSynced"
            },
            "id": "TaskList !Inbox:Restart-TaskList !Inbox:TasksToThreadsSynced-1",
            "labels": [
                {
                    "id": "TaskList !Inbox:Restart-TaskList !Inbox:TasksToThreadsSynced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Inbox:Restart"
            },
            "target": {
                "id": "TaskList !Inbox:CompletedThreadsSynced"
            },
            "id": "TaskList !Inbox:Restart-TaskList !Inbox:CompletedThreadsSynced-1",
            "labels": [
                {
                    "id": "TaskList !Inbox:Restart-TaskList !Inbox:CompletedThreadsSynced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Inbox:Restart"
            },
            "target": {
                "id": "TaskList !Inbox:TasksCached"
            },
            "id": "TaskList !Inbox:Restart-TaskList !Inbox:TasksCached-1",
            "labels": [
                {
                    "id": "TaskList !Inbox:Restart-TaskList !Inbox:TasksCached-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Inbox:PreparingList"
            },
            "target": {
                "id": "TaskList !Inbox:ListReady"
            },
            "id": "TaskList !Inbox:PreparingList-TaskList !Inbox:ListReady-1",
            "labels": [
                {
                    "id": "TaskList !Inbox:PreparingList-TaskList !Inbox:ListReady-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Inbox:PreparingList"
            },
            "target": {
                "id": "TaskList !Inbox:Syncing"
            },
            "id": "TaskList !Inbox:PreparingList-TaskList !Inbox:Syncing-0",
            "labels": [
                {
                    "id": "TaskList !Inbox:PreparingList-TaskList !Inbox:Syncing-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Inbox:ListReady"
            },
            "target": {
                "id": "TaskList !Inbox:PreparingList"
            },
            "id": "TaskList !Inbox:ListReady-TaskList !Inbox:PreparingList-1",
            "labels": [
                {
                    "id": "TaskList !Inbox:ListReady-TaskList !Inbox:PreparingList-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Inbox:FetchingTasks"
            },
            "target": {
                "id": "TaskList !Inbox:TasksFetched"
            },
            "id": "TaskList !Inbox:FetchingTasks-TaskList !Inbox:TasksFetched-1",
            "labels": [
                {
                    "id": "TaskList !Inbox:FetchingTasks-TaskList !Inbox:TasksFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Inbox:FetchingTasks"
            },
            "target": {
                "id": "TaskList !Inbox:Syncing"
            },
            "id": "TaskList !Inbox:FetchingTasks-TaskList !Inbox:Syncing-0",
            "labels": [
                {
                    "id": "TaskList !Inbox:FetchingTasks-TaskList !Inbox:Syncing-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Inbox:FetchingTasks"
            },
            "target": {
                "id": "TaskList !Inbox:ListReady"
            },
            "id": "TaskList !Inbox:FetchingTasks-TaskList !Inbox:ListReady-0",
            "labels": [
                {
                    "id": "TaskList !Inbox:FetchingTasks-TaskList !Inbox:ListReady-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Inbox:TasksFetched"
            },
            "target": {
                "id": "TaskList !Inbox:FetchingTasks"
            },
            "id": "TaskList !Inbox:TasksFetched-TaskList !Inbox:FetchingTasks-1",
            "labels": [
                {
                    "id": "TaskList !Inbox:TasksFetched-TaskList !Inbox:FetchingTasks-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Inbox:TasksFetched"
            },
            "target": {
                "id": "TaskList !Inbox:ListReady"
            },
            "id": "TaskList !Inbox:TasksFetched-TaskList !Inbox:ListReady-0",
            "labels": [
                {
                    "id": "TaskList !Inbox:TasksFetched-TaskList !Inbox:ListReady-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Inbox:SyncingThreadsToTasks"
            },
            "target": {
                "id": "TaskList !Inbox:ThreadsToTasksSynced"
            },
            "id": "TaskList !Inbox:SyncingThreadsToTasks-TaskList !Inbox:ThreadsToTasksSynced-1",
            "labels": [
                {
                    "id": "TaskList !Inbox:SyncingThreadsToTasks-TaskList !Inbox:ThreadsToTasksSynced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Inbox:SyncingThreadsToTasks"
            },
            "target": {
                "id": "TaskList !Inbox:Syncing"
            },
            "id": "TaskList !Inbox:SyncingThreadsToTasks-TaskList !Inbox:Syncing-0",
            "labels": [
                {
                    "id": "TaskList !Inbox:SyncingThreadsToTasks-TaskList !Inbox:Syncing-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Inbox:SyncingThreadsToTasks"
            },
            "target": {
                "id": "TaskList !Inbox:TasksFetched"
            },
            "id": "TaskList !Inbox:SyncingThreadsToTasks-TaskList !Inbox:TasksFetched-0",
            "labels": [
                {
                    "id": "TaskList !Inbox:SyncingThreadsToTasks-TaskList !Inbox:TasksFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Inbox:SyncingThreadsToTasks"
            },
            "target": {
                "id": "TaskList !Inbox:MsgsFetched"
            },
            "id": "TaskList !Inbox:SyncingThreadsToTasks-TaskList !Inbox:MsgsFetched-0",
            "labels": [
                {
                    "id": "TaskList !Inbox:SyncingThreadsToTasks-TaskList !Inbox:MsgsFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Inbox:ThreadsToTasksSynced"
            },
            "target": {
                "id": "TaskList !Inbox:SyncingThreadsToTasks"
            },
            "id": "TaskList !Inbox:ThreadsToTasksSynced-TaskList !Inbox:SyncingThreadsToTasks-1",
            "labels": [
                {
                    "id": "TaskList !Inbox:ThreadsToTasksSynced-TaskList !Inbox:SyncingThreadsToTasks-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Inbox:SyncingTasksToThreads"
            },
            "target": {
                "id": "TaskList !Inbox:TasksToThreadsSynced"
            },
            "id": "TaskList !Inbox:SyncingTasksToThreads-TaskList !Inbox:TasksToThreadsSynced-1",
            "labels": [
                {
                    "id": "TaskList !Inbox:SyncingTasksToThreads-TaskList !Inbox:TasksToThreadsSynced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Inbox:SyncingTasksToThreads"
            },
            "target": {
                "id": "TaskList !Inbox:Syncing"
            },
            "id": "TaskList !Inbox:SyncingTasksToThreads-TaskList !Inbox:Syncing-0",
            "labels": [
                {
                    "id": "TaskList !Inbox:SyncingTasksToThreads-TaskList !Inbox:Syncing-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Inbox:SyncingTasksToThreads"
            },
            "target": {
                "id": "TaskList !Inbox:TasksFetched"
            },
            "id": "TaskList !Inbox:SyncingTasksToThreads-TaskList !Inbox:TasksFetched-0",
            "labels": [
                {
                    "id": "TaskList !Inbox:SyncingTasksToThreads-TaskList !Inbox:TasksFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Inbox:SyncingTasksToThreads"
            },
            "target": {
                "id": "TaskList !Inbox:ThreadsFetched"
            },
            "id": "TaskList !Inbox:SyncingTasksToThreads-TaskList !Inbox:ThreadsFetched-0",
            "labels": [
                {
                    "id": "TaskList !Inbox:SyncingTasksToThreads-TaskList !Inbox:ThreadsFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Inbox:TasksToThreadsSynced"
            },
            "target": {
                "id": "TaskList !Inbox:SyncingTasksToThreads"
            },
            "id": "TaskList !Inbox:TasksToThreadsSynced-TaskList !Inbox:SyncingTasksToThreads-1",
            "labels": [
                {
                    "id": "TaskList !Inbox:TasksToThreadsSynced-TaskList !Inbox:SyncingTasksToThreads-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Inbox:SyncingCompletedThreads"
            },
            "target": {
                "id": "TaskList !Inbox:CompletedThreadsSynced"
            },
            "id": "TaskList !Inbox:SyncingCompletedThreads-TaskList !Inbox:CompletedThreadsSynced-1",
            "labels": [
                {
                    "id": "TaskList !Inbox:SyncingCompletedThreads-TaskList !Inbox:CompletedThreadsSynced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Inbox:SyncingCompletedThreads"
            },
            "target": {
                "id": "TaskList !Inbox:Syncing"
            },
            "id": "TaskList !Inbox:SyncingCompletedThreads-TaskList !Inbox:Syncing-0",
            "labels": [
                {
                    "id": "TaskList !Inbox:SyncingCompletedThreads-TaskList !Inbox:Syncing-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Inbox:SyncingCompletedThreads"
            },
            "target": {
                "id": "TaskList !Inbox:TasksFetched"
            },
            "id": "TaskList !Inbox:SyncingCompletedThreads-TaskList !Inbox:TasksFetched-0",
            "labels": [
                {
                    "id": "TaskList !Inbox:SyncingCompletedThreads-TaskList !Inbox:TasksFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Inbox:SyncingCompletedThreads"
            },
            "target": {
                "id": "TaskList !Inbox:ThreadsFetched"
            },
            "id": "TaskList !Inbox:SyncingCompletedThreads-TaskList !Inbox:ThreadsFetched-0",
            "labels": [
                {
                    "id": "TaskList !Inbox:SyncingCompletedThreads-TaskList !Inbox:ThreadsFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Inbox:CompletedThreadsSynced"
            },
            "target": {
                "id": "TaskList !Inbox:SyncingCompletedThreads"
            },
            "id": "TaskList !Inbox:CompletedThreadsSynced-TaskList !Inbox:SyncingCompletedThreads-1",
            "labels": [
                {
                    "id": "TaskList !Inbox:CompletedThreadsSynced-TaskList !Inbox:SyncingCompletedThreads-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Inbox:SyncingCompletedTasks"
            },
            "target": {
                "id": "TaskList !Inbox:CompletedTasksSynced"
            },
            "id": "TaskList !Inbox:SyncingCompletedTasks-TaskList !Inbox:CompletedTasksSynced-1",
            "labels": [
                {
                    "id": "TaskList !Inbox:SyncingCompletedTasks-TaskList !Inbox:CompletedTasksSynced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Inbox:SyncingCompletedTasks"
            },
            "target": {
                "id": "TaskList !Inbox:Syncing"
            },
            "id": "TaskList !Inbox:SyncingCompletedTasks-TaskList !Inbox:Syncing-0",
            "labels": [
                {
                    "id": "TaskList !Inbox:SyncingCompletedTasks-TaskList !Inbox:Syncing-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Inbox:SyncingCompletedTasks"
            },
            "target": {
                "id": "TaskList !Inbox:TasksFetched"
            },
            "id": "TaskList !Inbox:SyncingCompletedTasks-TaskList !Inbox:TasksFetched-0",
            "labels": [
                {
                    "id": "TaskList !Inbox:SyncingCompletedTasks-TaskList !Inbox:TasksFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Inbox:SyncingCompletedTasks"
            },
            "target": {
                "id": "TaskList !Inbox:ThreadsFetched"
            },
            "id": "TaskList !Inbox:SyncingCompletedTasks-TaskList !Inbox:ThreadsFetched-0",
            "labels": [
                {
                    "id": "TaskList !Inbox:SyncingCompletedTasks-TaskList !Inbox:ThreadsFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Inbox:CompletedTasksSynced"
            },
            "target": {
                "id": "TaskList !Inbox:SyncingCompletedTasks"
            },
            "id": "TaskList !Inbox:CompletedTasksSynced-TaskList !Inbox:SyncingCompletedTasks-1",
            "labels": [
                {
                    "id": "TaskList !Inbox:CompletedTasksSynced-TaskList !Inbox:SyncingCompletedTasks-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Inbox':Dirty"
            },
            "target": {
                "id": "GmailQuery '!Inbox':MsgsFetched"
            },
            "id": "GmailQuery '!Inbox':Dirty-GmailQuery '!Inbox':MsgsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery '!Inbox':Dirty-GmailQuery '!Inbox':MsgsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Inbox':Dirty"
            },
            "target": {
                "id": "GmailQuery '!Inbox':ThreadsFetched"
            },
            "id": "GmailQuery '!Inbox':Dirty-GmailQuery '!Inbox':ThreadsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery '!Inbox':Dirty-GmailQuery '!Inbox':ThreadsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Inbox':FetchingThreads"
            },
            "target": {
                "id": "GmailQuery '!Inbox':ThreadsFetched"
            },
            "id": "GmailQuery '!Inbox':FetchingThreads-GmailQuery '!Inbox':ThreadsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery '!Inbox':FetchingThreads-GmailQuery '!Inbox':ThreadsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Inbox':FetchingThreads"
            },
            "target": {
                "id": "GmailQuery '!Inbox':Enabled"
            },
            "id": "GmailQuery '!Inbox':FetchingThreads-GmailQuery '!Inbox':Enabled-0",
            "labels": [
                {
                    "id": "GmailQuery '!Inbox':FetchingThreads-GmailQuery '!Inbox':Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Inbox':ThreadsFetched"
            },
            "target": {
                "id": "GmailQuery '!Inbox':FetchingThreads"
            },
            "id": "GmailQuery '!Inbox':ThreadsFetched-GmailQuery '!Inbox':FetchingThreads-1",
            "labels": [
                {
                    "id": "GmailQuery '!Inbox':ThreadsFetched-GmailQuery '!Inbox':FetchingThreads-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Inbox':ThreadsFetched"
            },
            "target": {
                "id": "GmailQuery '!Inbox':Enabled"
            },
            "id": "GmailQuery '!Inbox':ThreadsFetched-GmailQuery '!Inbox':Enabled-0",
            "labels": [
                {
                    "id": "GmailQuery '!Inbox':ThreadsFetched-GmailQuery '!Inbox':Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Inbox':ThreadsFetched"
            },
            "target": {
                "id": "TaskList !Inbox:ThreadsFetched"
            },
            "id": "GmailQuery '!Inbox':ThreadsFetched-TaskList !Inbox:ThreadsFetched-4",
            "labels": [
                {
                    "id": "GmailQuery '!Inbox':ThreadsFetched-TaskList !Inbox:ThreadsFetched-4-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "add"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Inbox':FetchingMsgs"
            },
            "target": {
                "id": "GmailQuery '!Inbox':MsgsFetched"
            },
            "id": "GmailQuery '!Inbox':FetchingMsgs-GmailQuery '!Inbox':MsgsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery '!Inbox':FetchingMsgs-GmailQuery '!Inbox':MsgsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Inbox':FetchingMsgs"
            },
            "target": {
                "id": "GmailQuery '!Inbox':Enabled"
            },
            "id": "GmailQuery '!Inbox':FetchingMsgs-GmailQuery '!Inbox':Enabled-0",
            "labels": [
                {
                    "id": "GmailQuery '!Inbox':FetchingMsgs-GmailQuery '!Inbox':Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Inbox':FetchingMsgs"
            },
            "target": {
                "id": "GmailQuery '!Inbox':ThreadsFetched"
            },
            "id": "GmailQuery '!Inbox':FetchingMsgs-GmailQuery '!Inbox':ThreadsFetched-0",
            "labels": [
                {
                    "id": "GmailQuery '!Inbox':FetchingMsgs-GmailQuery '!Inbox':ThreadsFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Inbox':MsgsFetched"
            },
            "target": {
                "id": "GmailQuery '!Inbox':FetchingMsgs"
            },
            "id": "GmailQuery '!Inbox':MsgsFetched-GmailQuery '!Inbox':FetchingMsgs-1",
            "labels": [
                {
                    "id": "GmailQuery '!Inbox':MsgsFetched-GmailQuery '!Inbox':FetchingMsgs-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Inbox':MsgsFetched"
            },
            "target": {
                "id": "TaskList !Inbox:MsgsFetched"
            },
            "id": "GmailQuery '!Inbox':MsgsFetched-TaskList !Inbox:MsgsFetched-4",
            "labels": [
                {
                    "id": "GmailQuery '!Inbox':MsgsFetched-TaskList !Inbox:MsgsFetched-4-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "add"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Inbox:Enabled"
            },
            "target": {
                "id": "GmailQuery '!Inbox':Enabled"
            },
            "id": "TaskList !Inbox:Enabled-GmailQuery '!Inbox':Enabled-4",
            "labels": [
                {
                    "id": "TaskList !Inbox:Enabled-GmailQuery '!Inbox':Enabled-4-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "add"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Next:Syncing"
            },
            "target": {
                "id": "TaskList !Next:Synced"
            },
            "id": "TaskList !Next:Syncing-TaskList !Next:Synced-1",
            "labels": [
                {
                    "id": "TaskList !Next:Syncing-TaskList !Next:Synced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Next:Syncing"
            },
            "target": {
                "id": "TaskList !Next:Restart"
            },
            "id": "TaskList !Next:Syncing-TaskList !Next:Restart-1",
            "labels": [
                {
                    "id": "TaskList !Next:Syncing-TaskList !Next:Restart-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Next:Syncing"
            },
            "target": {
                "id": "TaskList !Next:Enabled"
            },
            "id": "TaskList !Next:Syncing-TaskList !Next:Enabled-0",
            "labels": [
                {
                    "id": "TaskList !Next:Syncing-TaskList !Next:Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Next:Syncing"
            },
            "target": {
                "id": "Sync:SyncingTaskLists"
            },
            "id": "TaskList !Next:Syncing-Sync:SyncingTaskLists-4",
            "labels": [
                {
                    "id": "TaskList !Next:Syncing-Sync:SyncingTaskLists-4-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "add"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Next:Synced"
            },
            "target": {
                "id": "TaskList !Next:Syncing"
            },
            "id": "TaskList !Next:Synced-TaskList !Next:Syncing-1",
            "labels": [
                {
                    "id": "TaskList !Next:Synced-TaskList !Next:Syncing-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Next:Synced"
            },
            "target": {
                "id": "TaskList !Next:CompletedTasksSynced"
            },
            "id": "TaskList !Next:Synced-TaskList !Next:CompletedTasksSynced-0",
            "labels": [
                {
                    "id": "TaskList !Next:Synced-TaskList !Next:CompletedTasksSynced-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Next:Synced"
            },
            "target": {
                "id": "TaskList !Next:ThreadsToTasksSynced"
            },
            "id": "TaskList !Next:Synced-TaskList !Next:ThreadsToTasksSynced-0",
            "labels": [
                {
                    "id": "TaskList !Next:Synced-TaskList !Next:ThreadsToTasksSynced-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Next:Synced"
            },
            "target": {
                "id": "TaskList !Next:TasksToThreadsSynced"
            },
            "id": "TaskList !Next:Synced-TaskList !Next:TasksToThreadsSynced-0",
            "labels": [
                {
                    "id": "TaskList !Next:Synced-TaskList !Next:TasksToThreadsSynced-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Next:Synced"
            },
            "target": {
                "id": "TaskList !Next:CompletedThreadsSynced"
            },
            "id": "TaskList !Next:Synced-TaskList !Next:CompletedThreadsSynced-0",
            "labels": [
                {
                    "id": "TaskList !Next:Synced-TaskList !Next:CompletedThreadsSynced-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Next:Synced"
            },
            "target": {
                "id": "Sync:TaskListsSynced"
            },
            "id": "TaskList !Next:Synced-Sync:TaskListsSynced-4",
            "labels": [
                {
                    "id": "TaskList !Next:Synced-Sync:TaskListsSynced-4-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "add"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Next:Restart"
            },
            "target": {
                "id": "TaskList !Next:TasksFetched"
            },
            "id": "TaskList !Next:Restart-TaskList !Next:TasksFetched-1",
            "labels": [
                {
                    "id": "TaskList !Next:Restart-TaskList !Next:TasksFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Next:Restart"
            },
            "target": {
                "id": "TaskList !Next:CompletedTasksSynced"
            },
            "id": "TaskList !Next:Restart-TaskList !Next:CompletedTasksSynced-1",
            "labels": [
                {
                    "id": "TaskList !Next:Restart-TaskList !Next:CompletedTasksSynced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Next:Restart"
            },
            "target": {
                "id": "TaskList !Next:ThreadsToTasksSynced"
            },
            "id": "TaskList !Next:Restart-TaskList !Next:ThreadsToTasksSynced-1",
            "labels": [
                {
                    "id": "TaskList !Next:Restart-TaskList !Next:ThreadsToTasksSynced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Next:Restart"
            },
            "target": {
                "id": "TaskList !Next:TasksToThreadsSynced"
            },
            "id": "TaskList !Next:Restart-TaskList !Next:TasksToThreadsSynced-1",
            "labels": [
                {
                    "id": "TaskList !Next:Restart-TaskList !Next:TasksToThreadsSynced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Next:Restart"
            },
            "target": {
                "id": "TaskList !Next:CompletedThreadsSynced"
            },
            "id": "TaskList !Next:Restart-TaskList !Next:CompletedThreadsSynced-1",
            "labels": [
                {
                    "id": "TaskList !Next:Restart-TaskList !Next:CompletedThreadsSynced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Next:Restart"
            },
            "target": {
                "id": "TaskList !Next:TasksCached"
            },
            "id": "TaskList !Next:Restart-TaskList !Next:TasksCached-1",
            "labels": [
                {
                    "id": "TaskList !Next:Restart-TaskList !Next:TasksCached-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Next:PreparingList"
            },
            "target": {
                "id": "TaskList !Next:ListReady"
            },
            "id": "TaskList !Next:PreparingList-TaskList !Next:ListReady-1",
            "labels": [
                {
                    "id": "TaskList !Next:PreparingList-TaskList !Next:ListReady-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Next:PreparingList"
            },
            "target": {
                "id": "TaskList !Next:Syncing"
            },
            "id": "TaskList !Next:PreparingList-TaskList !Next:Syncing-0",
            "labels": [
                {
                    "id": "TaskList !Next:PreparingList-TaskList !Next:Syncing-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Next:ListReady"
            },
            "target": {
                "id": "TaskList !Next:PreparingList"
            },
            "id": "TaskList !Next:ListReady-TaskList !Next:PreparingList-1",
            "labels": [
                {
                    "id": "TaskList !Next:ListReady-TaskList !Next:PreparingList-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Next:FetchingTasks"
            },
            "target": {
                "id": "TaskList !Next:TasksFetched"
            },
            "id": "TaskList !Next:FetchingTasks-TaskList !Next:TasksFetched-1",
            "labels": [
                {
                    "id": "TaskList !Next:FetchingTasks-TaskList !Next:TasksFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Next:FetchingTasks"
            },
            "target": {
                "id": "TaskList !Next:Syncing"
            },
            "id": "TaskList !Next:FetchingTasks-TaskList !Next:Syncing-0",
            "labels": [
                {
                    "id": "TaskList !Next:FetchingTasks-TaskList !Next:Syncing-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Next:FetchingTasks"
            },
            "target": {
                "id": "TaskList !Next:ListReady"
            },
            "id": "TaskList !Next:FetchingTasks-TaskList !Next:ListReady-0",
            "labels": [
                {
                    "id": "TaskList !Next:FetchingTasks-TaskList !Next:ListReady-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Next:TasksFetched"
            },
            "target": {
                "id": "TaskList !Next:FetchingTasks"
            },
            "id": "TaskList !Next:TasksFetched-TaskList !Next:FetchingTasks-1",
            "labels": [
                {
                    "id": "TaskList !Next:TasksFetched-TaskList !Next:FetchingTasks-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Next:TasksFetched"
            },
            "target": {
                "id": "TaskList !Next:ListReady"
            },
            "id": "TaskList !Next:TasksFetched-TaskList !Next:ListReady-0",
            "labels": [
                {
                    "id": "TaskList !Next:TasksFetched-TaskList !Next:ListReady-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Next:SyncingThreadsToTasks"
            },
            "target": {
                "id": "TaskList !Next:ThreadsToTasksSynced"
            },
            "id": "TaskList !Next:SyncingThreadsToTasks-TaskList !Next:ThreadsToTasksSynced-1",
            "labels": [
                {
                    "id": "TaskList !Next:SyncingThreadsToTasks-TaskList !Next:ThreadsToTasksSynced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Next:SyncingThreadsToTasks"
            },
            "target": {
                "id": "TaskList !Next:Syncing"
            },
            "id": "TaskList !Next:SyncingThreadsToTasks-TaskList !Next:Syncing-0",
            "labels": [
                {
                    "id": "TaskList !Next:SyncingThreadsToTasks-TaskList !Next:Syncing-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Next:SyncingThreadsToTasks"
            },
            "target": {
                "id": "TaskList !Next:TasksFetched"
            },
            "id": "TaskList !Next:SyncingThreadsToTasks-TaskList !Next:TasksFetched-0",
            "labels": [
                {
                    "id": "TaskList !Next:SyncingThreadsToTasks-TaskList !Next:TasksFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Next:SyncingThreadsToTasks"
            },
            "target": {
                "id": "TaskList !Next:MsgsFetched"
            },
            "id": "TaskList !Next:SyncingThreadsToTasks-TaskList !Next:MsgsFetched-0",
            "labels": [
                {
                    "id": "TaskList !Next:SyncingThreadsToTasks-TaskList !Next:MsgsFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Next:ThreadsToTasksSynced"
            },
            "target": {
                "id": "TaskList !Next:SyncingThreadsToTasks"
            },
            "id": "TaskList !Next:ThreadsToTasksSynced-TaskList !Next:SyncingThreadsToTasks-1",
            "labels": [
                {
                    "id": "TaskList !Next:ThreadsToTasksSynced-TaskList !Next:SyncingThreadsToTasks-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Next:SyncingTasksToThreads"
            },
            "target": {
                "id": "TaskList !Next:TasksToThreadsSynced"
            },
            "id": "TaskList !Next:SyncingTasksToThreads-TaskList !Next:TasksToThreadsSynced-1",
            "labels": [
                {
                    "id": "TaskList !Next:SyncingTasksToThreads-TaskList !Next:TasksToThreadsSynced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Next:SyncingTasksToThreads"
            },
            "target": {
                "id": "TaskList !Next:Syncing"
            },
            "id": "TaskList !Next:SyncingTasksToThreads-TaskList !Next:Syncing-0",
            "labels": [
                {
                    "id": "TaskList !Next:SyncingTasksToThreads-TaskList !Next:Syncing-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Next:SyncingTasksToThreads"
            },
            "target": {
                "id": "TaskList !Next:TasksFetched"
            },
            "id": "TaskList !Next:SyncingTasksToThreads-TaskList !Next:TasksFetched-0",
            "labels": [
                {
                    "id": "TaskList !Next:SyncingTasksToThreads-TaskList !Next:TasksFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Next:SyncingTasksToThreads"
            },
            "target": {
                "id": "TaskList !Next:ThreadsFetched"
            },
            "id": "TaskList !Next:SyncingTasksToThreads-TaskList !Next:ThreadsFetched-0",
            "labels": [
                {
                    "id": "TaskList !Next:SyncingTasksToThreads-TaskList !Next:ThreadsFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Next:TasksToThreadsSynced"
            },
            "target": {
                "id": "TaskList !Next:SyncingTasksToThreads"
            },
            "id": "TaskList !Next:TasksToThreadsSynced-TaskList !Next:SyncingTasksToThreads-1",
            "labels": [
                {
                    "id": "TaskList !Next:TasksToThreadsSynced-TaskList !Next:SyncingTasksToThreads-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Next:SyncingCompletedThreads"
            },
            "target": {
                "id": "TaskList !Next:CompletedThreadsSynced"
            },
            "id": "TaskList !Next:SyncingCompletedThreads-TaskList !Next:CompletedThreadsSynced-1",
            "labels": [
                {
                    "id": "TaskList !Next:SyncingCompletedThreads-TaskList !Next:CompletedThreadsSynced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Next:SyncingCompletedThreads"
            },
            "target": {
                "id": "TaskList !Next:Syncing"
            },
            "id": "TaskList !Next:SyncingCompletedThreads-TaskList !Next:Syncing-0",
            "labels": [
                {
                    "id": "TaskList !Next:SyncingCompletedThreads-TaskList !Next:Syncing-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Next:SyncingCompletedThreads"
            },
            "target": {
                "id": "TaskList !Next:TasksFetched"
            },
            "id": "TaskList !Next:SyncingCompletedThreads-TaskList !Next:TasksFetched-0",
            "labels": [
                {
                    "id": "TaskList !Next:SyncingCompletedThreads-TaskList !Next:TasksFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Next:SyncingCompletedThreads"
            },
            "target": {
                "id": "TaskList !Next:ThreadsFetched"
            },
            "id": "TaskList !Next:SyncingCompletedThreads-TaskList !Next:ThreadsFetched-0",
            "labels": [
                {
                    "id": "TaskList !Next:SyncingCompletedThreads-TaskList !Next:ThreadsFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Next:CompletedThreadsSynced"
            },
            "target": {
                "id": "TaskList !Next:SyncingCompletedThreads"
            },
            "id": "TaskList !Next:CompletedThreadsSynced-TaskList !Next:SyncingCompletedThreads-1",
            "labels": [
                {
                    "id": "TaskList !Next:CompletedThreadsSynced-TaskList !Next:SyncingCompletedThreads-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Next:SyncingCompletedTasks"
            },
            "target": {
                "id": "TaskList !Next:CompletedTasksSynced"
            },
            "id": "TaskList !Next:SyncingCompletedTasks-TaskList !Next:CompletedTasksSynced-1",
            "labels": [
                {
                    "id": "TaskList !Next:SyncingCompletedTasks-TaskList !Next:CompletedTasksSynced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Next:SyncingCompletedTasks"
            },
            "target": {
                "id": "TaskList !Next:Syncing"
            },
            "id": "TaskList !Next:SyncingCompletedTasks-TaskList !Next:Syncing-0",
            "labels": [
                {
                    "id": "TaskList !Next:SyncingCompletedTasks-TaskList !Next:Syncing-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Next:SyncingCompletedTasks"
            },
            "target": {
                "id": "TaskList !Next:TasksFetched"
            },
            "id": "TaskList !Next:SyncingCompletedTasks-TaskList !Next:TasksFetched-0",
            "labels": [
                {
                    "id": "TaskList !Next:SyncingCompletedTasks-TaskList !Next:TasksFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Next:SyncingCompletedTasks"
            },
            "target": {
                "id": "TaskList !Next:ThreadsFetched"
            },
            "id": "TaskList !Next:SyncingCompletedTasks-TaskList !Next:ThreadsFetched-0",
            "labels": [
                {
                    "id": "TaskList !Next:SyncingCompletedTasks-TaskList !Next:ThreadsFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Next:CompletedTasksSynced"
            },
            "target": {
                "id": "TaskList !Next:SyncingCompletedTasks"
            },
            "id": "TaskList !Next:CompletedTasksSynced-TaskList !Next:SyncingCompletedTasks-1",
            "labels": [
                {
                    "id": "TaskList !Next:CompletedTasksSynced-TaskList !Next:SyncingCompletedTasks-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Next':Dirty"
            },
            "target": {
                "id": "GmailQuery '!Next':MsgsFetched"
            },
            "id": "GmailQuery '!Next':Dirty-GmailQuery '!Next':MsgsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery '!Next':Dirty-GmailQuery '!Next':MsgsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Next':Dirty"
            },
            "target": {
                "id": "GmailQuery '!Next':ThreadsFetched"
            },
            "id": "GmailQuery '!Next':Dirty-GmailQuery '!Next':ThreadsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery '!Next':Dirty-GmailQuery '!Next':ThreadsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Next':FetchingThreads"
            },
            "target": {
                "id": "GmailQuery '!Next':ThreadsFetched"
            },
            "id": "GmailQuery '!Next':FetchingThreads-GmailQuery '!Next':ThreadsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery '!Next':FetchingThreads-GmailQuery '!Next':ThreadsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Next':FetchingThreads"
            },
            "target": {
                "id": "GmailQuery '!Next':Enabled"
            },
            "id": "GmailQuery '!Next':FetchingThreads-GmailQuery '!Next':Enabled-0",
            "labels": [
                {
                    "id": "GmailQuery '!Next':FetchingThreads-GmailQuery '!Next':Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Next':ThreadsFetched"
            },
            "target": {
                "id": "GmailQuery '!Next':FetchingThreads"
            },
            "id": "GmailQuery '!Next':ThreadsFetched-GmailQuery '!Next':FetchingThreads-1",
            "labels": [
                {
                    "id": "GmailQuery '!Next':ThreadsFetched-GmailQuery '!Next':FetchingThreads-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Next':ThreadsFetched"
            },
            "target": {
                "id": "GmailQuery '!Next':Enabled"
            },
            "id": "GmailQuery '!Next':ThreadsFetched-GmailQuery '!Next':Enabled-0",
            "labels": [
                {
                    "id": "GmailQuery '!Next':ThreadsFetched-GmailQuery '!Next':Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Next':ThreadsFetched"
            },
            "target": {
                "id": "TaskList !Next:ThreadsFetched"
            },
            "id": "GmailQuery '!Next':ThreadsFetched-TaskList !Next:ThreadsFetched-4",
            "labels": [
                {
                    "id": "GmailQuery '!Next':ThreadsFetched-TaskList !Next:ThreadsFetched-4-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "add"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Next':FetchingMsgs"
            },
            "target": {
                "id": "GmailQuery '!Next':MsgsFetched"
            },
            "id": "GmailQuery '!Next':FetchingMsgs-GmailQuery '!Next':MsgsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery '!Next':FetchingMsgs-GmailQuery '!Next':MsgsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Next':FetchingMsgs"
            },
            "target": {
                "id": "GmailQuery '!Next':Enabled"
            },
            "id": "GmailQuery '!Next':FetchingMsgs-GmailQuery '!Next':Enabled-0",
            "labels": [
                {
                    "id": "GmailQuery '!Next':FetchingMsgs-GmailQuery '!Next':Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Next':FetchingMsgs"
            },
            "target": {
                "id": "GmailQuery '!Next':ThreadsFetched"
            },
            "id": "GmailQuery '!Next':FetchingMsgs-GmailQuery '!Next':ThreadsFetched-0",
            "labels": [
                {
                    "id": "GmailQuery '!Next':FetchingMsgs-GmailQuery '!Next':ThreadsFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Next':MsgsFetched"
            },
            "target": {
                "id": "GmailQuery '!Next':FetchingMsgs"
            },
            "id": "GmailQuery '!Next':MsgsFetched-GmailQuery '!Next':FetchingMsgs-1",
            "labels": [
                {
                    "id": "GmailQuery '!Next':MsgsFetched-GmailQuery '!Next':FetchingMsgs-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Next':MsgsFetched"
            },
            "target": {
                "id": "TaskList !Next:MsgsFetched"
            },
            "id": "GmailQuery '!Next':MsgsFetched-TaskList !Next:MsgsFetched-4",
            "labels": [
                {
                    "id": "GmailQuery '!Next':MsgsFetched-TaskList !Next:MsgsFetched-4-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "add"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Next:Enabled"
            },
            "target": {
                "id": "GmailQuery '!Next':Enabled"
            },
            "id": "TaskList !Next:Enabled-GmailQuery '!Next':Enabled-4",
            "labels": [
                {
                    "id": "TaskList !Next:Enabled-GmailQuery '!Next':Enabled-4-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "add"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Actions:Syncing"
            },
            "target": {
                "id": "TaskList !Actions:Synced"
            },
            "id": "TaskList !Actions:Syncing-TaskList !Actions:Synced-1",
            "labels": [
                {
                    "id": "TaskList !Actions:Syncing-TaskList !Actions:Synced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Actions:Syncing"
            },
            "target": {
                "id": "TaskList !Actions:Restart"
            },
            "id": "TaskList !Actions:Syncing-TaskList !Actions:Restart-1",
            "labels": [
                {
                    "id": "TaskList !Actions:Syncing-TaskList !Actions:Restart-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Actions:Syncing"
            },
            "target": {
                "id": "TaskList !Actions:Enabled"
            },
            "id": "TaskList !Actions:Syncing-TaskList !Actions:Enabled-0",
            "labels": [
                {
                    "id": "TaskList !Actions:Syncing-TaskList !Actions:Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Actions:Syncing"
            },
            "target": {
                "id": "Sync:SyncingTaskLists"
            },
            "id": "TaskList !Actions:Syncing-Sync:SyncingTaskLists-4",
            "labels": [
                {
                    "id": "TaskList !Actions:Syncing-Sync:SyncingTaskLists-4-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "add"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Actions:Synced"
            },
            "target": {
                "id": "TaskList !Actions:Syncing"
            },
            "id": "TaskList !Actions:Synced-TaskList !Actions:Syncing-1",
            "labels": [
                {
                    "id": "TaskList !Actions:Synced-TaskList !Actions:Syncing-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Actions:Synced"
            },
            "target": {
                "id": "TaskList !Actions:CompletedTasksSynced"
            },
            "id": "TaskList !Actions:Synced-TaskList !Actions:CompletedTasksSynced-0",
            "labels": [
                {
                    "id": "TaskList !Actions:Synced-TaskList !Actions:CompletedTasksSynced-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Actions:Synced"
            },
            "target": {
                "id": "TaskList !Actions:ThreadsToTasksSynced"
            },
            "id": "TaskList !Actions:Synced-TaskList !Actions:ThreadsToTasksSynced-0",
            "labels": [
                {
                    "id": "TaskList !Actions:Synced-TaskList !Actions:ThreadsToTasksSynced-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Actions:Synced"
            },
            "target": {
                "id": "TaskList !Actions:TasksToThreadsSynced"
            },
            "id": "TaskList !Actions:Synced-TaskList !Actions:TasksToThreadsSynced-0",
            "labels": [
                {
                    "id": "TaskList !Actions:Synced-TaskList !Actions:TasksToThreadsSynced-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Actions:Synced"
            },
            "target": {
                "id": "TaskList !Actions:CompletedThreadsSynced"
            },
            "id": "TaskList !Actions:Synced-TaskList !Actions:CompletedThreadsSynced-0",
            "labels": [
                {
                    "id": "TaskList !Actions:Synced-TaskList !Actions:CompletedThreadsSynced-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Actions:Synced"
            },
            "target": {
                "id": "Sync:TaskListsSynced"
            },
            "id": "TaskList !Actions:Synced-Sync:TaskListsSynced-4",
            "labels": [
                {
                    "id": "TaskList !Actions:Synced-Sync:TaskListsSynced-4-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "add"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Actions:Restart"
            },
            "target": {
                "id": "TaskList !Actions:TasksFetched"
            },
            "id": "TaskList !Actions:Restart-TaskList !Actions:TasksFetched-1",
            "labels": [
                {
                    "id": "TaskList !Actions:Restart-TaskList !Actions:TasksFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Actions:Restart"
            },
            "target": {
                "id": "TaskList !Actions:CompletedTasksSynced"
            },
            "id": "TaskList !Actions:Restart-TaskList !Actions:CompletedTasksSynced-1",
            "labels": [
                {
                    "id": "TaskList !Actions:Restart-TaskList !Actions:CompletedTasksSynced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Actions:Restart"
            },
            "target": {
                "id": "TaskList !Actions:ThreadsToTasksSynced"
            },
            "id": "TaskList !Actions:Restart-TaskList !Actions:ThreadsToTasksSynced-1",
            "labels": [
                {
                    "id": "TaskList !Actions:Restart-TaskList !Actions:ThreadsToTasksSynced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Actions:Restart"
            },
            "target": {
                "id": "TaskList !Actions:TasksToThreadsSynced"
            },
            "id": "TaskList !Actions:Restart-TaskList !Actions:TasksToThreadsSynced-1",
            "labels": [
                {
                    "id": "TaskList !Actions:Restart-TaskList !Actions:TasksToThreadsSynced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Actions:Restart"
            },
            "target": {
                "id": "TaskList !Actions:CompletedThreadsSynced"
            },
            "id": "TaskList !Actions:Restart-TaskList !Actions:CompletedThreadsSynced-1",
            "labels": [
                {
                    "id": "TaskList !Actions:Restart-TaskList !Actions:CompletedThreadsSynced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Actions:Restart"
            },
            "target": {
                "id": "TaskList !Actions:TasksCached"
            },
            "id": "TaskList !Actions:Restart-TaskList !Actions:TasksCached-1",
            "labels": [
                {
                    "id": "TaskList !Actions:Restart-TaskList !Actions:TasksCached-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Actions:PreparingList"
            },
            "target": {
                "id": "TaskList !Actions:ListReady"
            },
            "id": "TaskList !Actions:PreparingList-TaskList !Actions:ListReady-1",
            "labels": [
                {
                    "id": "TaskList !Actions:PreparingList-TaskList !Actions:ListReady-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Actions:PreparingList"
            },
            "target": {
                "id": "TaskList !Actions:Syncing"
            },
            "id": "TaskList !Actions:PreparingList-TaskList !Actions:Syncing-0",
            "labels": [
                {
                    "id": "TaskList !Actions:PreparingList-TaskList !Actions:Syncing-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Actions:ListReady"
            },
            "target": {
                "id": "TaskList !Actions:PreparingList"
            },
            "id": "TaskList !Actions:ListReady-TaskList !Actions:PreparingList-1",
            "labels": [
                {
                    "id": "TaskList !Actions:ListReady-TaskList !Actions:PreparingList-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Actions:FetchingTasks"
            },
            "target": {
                "id": "TaskList !Actions:TasksFetched"
            },
            "id": "TaskList !Actions:FetchingTasks-TaskList !Actions:TasksFetched-1",
            "labels": [
                {
                    "id": "TaskList !Actions:FetchingTasks-TaskList !Actions:TasksFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Actions:FetchingTasks"
            },
            "target": {
                "id": "TaskList !Actions:Syncing"
            },
            "id": "TaskList !Actions:FetchingTasks-TaskList !Actions:Syncing-0",
            "labels": [
                {
                    "id": "TaskList !Actions:FetchingTasks-TaskList !Actions:Syncing-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Actions:FetchingTasks"
            },
            "target": {
                "id": "TaskList !Actions:ListReady"
            },
            "id": "TaskList !Actions:FetchingTasks-TaskList !Actions:ListReady-0",
            "labels": [
                {
                    "id": "TaskList !Actions:FetchingTasks-TaskList !Actions:ListReady-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Actions:TasksFetched"
            },
            "target": {
                "id": "TaskList !Actions:FetchingTasks"
            },
            "id": "TaskList !Actions:TasksFetched-TaskList !Actions:FetchingTasks-1",
            "labels": [
                {
                    "id": "TaskList !Actions:TasksFetched-TaskList !Actions:FetchingTasks-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Actions:TasksFetched"
            },
            "target": {
                "id": "TaskList !Actions:ListReady"
            },
            "id": "TaskList !Actions:TasksFetched-TaskList !Actions:ListReady-0",
            "labels": [
                {
                    "id": "TaskList !Actions:TasksFetched-TaskList !Actions:ListReady-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Actions:SyncingThreadsToTasks"
            },
            "target": {
                "id": "TaskList !Actions:ThreadsToTasksSynced"
            },
            "id": "TaskList !Actions:SyncingThreadsToTasks-TaskList !Actions:ThreadsToTasksSynced-1",
            "labels": [
                {
                    "id": "TaskList !Actions:SyncingThreadsToTasks-TaskList !Actions:ThreadsToTasksSynced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Actions:SyncingThreadsToTasks"
            },
            "target": {
                "id": "TaskList !Actions:Syncing"
            },
            "id": "TaskList !Actions:SyncingThreadsToTasks-TaskList !Actions:Syncing-0",
            "labels": [
                {
                    "id": "TaskList !Actions:SyncingThreadsToTasks-TaskList !Actions:Syncing-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Actions:SyncingThreadsToTasks"
            },
            "target": {
                "id": "TaskList !Actions:TasksFetched"
            },
            "id": "TaskList !Actions:SyncingThreadsToTasks-TaskList !Actions:TasksFetched-0",
            "labels": [
                {
                    "id": "TaskList !Actions:SyncingThreadsToTasks-TaskList !Actions:TasksFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Actions:SyncingThreadsToTasks"
            },
            "target": {
                "id": "TaskList !Actions:MsgsFetched"
            },
            "id": "TaskList !Actions:SyncingThreadsToTasks-TaskList !Actions:MsgsFetched-0",
            "labels": [
                {
                    "id": "TaskList !Actions:SyncingThreadsToTasks-TaskList !Actions:MsgsFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Actions:ThreadsToTasksSynced"
            },
            "target": {
                "id": "TaskList !Actions:SyncingThreadsToTasks"
            },
            "id": "TaskList !Actions:ThreadsToTasksSynced-TaskList !Actions:SyncingThreadsToTasks-1",
            "labels": [
                {
                    "id": "TaskList !Actions:ThreadsToTasksSynced-TaskList !Actions:SyncingThreadsToTasks-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Actions:SyncingTasksToThreads"
            },
            "target": {
                "id": "TaskList !Actions:TasksToThreadsSynced"
            },
            "id": "TaskList !Actions:SyncingTasksToThreads-TaskList !Actions:TasksToThreadsSynced-1",
            "labels": [
                {
                    "id": "TaskList !Actions:SyncingTasksToThreads-TaskList !Actions:TasksToThreadsSynced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Actions:SyncingTasksToThreads"
            },
            "target": {
                "id": "TaskList !Actions:Syncing"
            },
            "id": "TaskList !Actions:SyncingTasksToThreads-TaskList !Actions:Syncing-0",
            "labels": [
                {
                    "id": "TaskList !Actions:SyncingTasksToThreads-TaskList !Actions:Syncing-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Actions:SyncingTasksToThreads"
            },
            "target": {
                "id": "TaskList !Actions:TasksFetched"
            },
            "id": "TaskList !Actions:SyncingTasksToThreads-TaskList !Actions:TasksFetched-0",
            "labels": [
                {
                    "id": "TaskList !Actions:SyncingTasksToThreads-TaskList !Actions:TasksFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Actions:SyncingTasksToThreads"
            },
            "target": {
                "id": "TaskList !Actions:ThreadsFetched"
            },
            "id": "TaskList !Actions:SyncingTasksToThreads-TaskList !Actions:ThreadsFetched-0",
            "labels": [
                {
                    "id": "TaskList !Actions:SyncingTasksToThreads-TaskList !Actions:ThreadsFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Actions:TasksToThreadsSynced"
            },
            "target": {
                "id": "TaskList !Actions:SyncingTasksToThreads"
            },
            "id": "TaskList !Actions:TasksToThreadsSynced-TaskList !Actions:SyncingTasksToThreads-1",
            "labels": [
                {
                    "id": "TaskList !Actions:TasksToThreadsSynced-TaskList !Actions:SyncingTasksToThreads-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Actions:SyncingCompletedThreads"
            },
            "target": {
                "id": "TaskList !Actions:CompletedThreadsSynced"
            },
            "id": "TaskList !Actions:SyncingCompletedThreads-TaskList !Actions:CompletedThreadsSynced-1",
            "labels": [
                {
                    "id": "TaskList !Actions:SyncingCompletedThreads-TaskList !Actions:CompletedThreadsSynced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Actions:SyncingCompletedThreads"
            },
            "target": {
                "id": "TaskList !Actions:Syncing"
            },
            "id": "TaskList !Actions:SyncingCompletedThreads-TaskList !Actions:Syncing-0",
            "labels": [
                {
                    "id": "TaskList !Actions:SyncingCompletedThreads-TaskList !Actions:Syncing-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Actions:SyncingCompletedThreads"
            },
            "target": {
                "id": "TaskList !Actions:TasksFetched"
            },
            "id": "TaskList !Actions:SyncingCompletedThreads-TaskList !Actions:TasksFetched-0",
            "labels": [
                {
                    "id": "TaskList !Actions:SyncingCompletedThreads-TaskList !Actions:TasksFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Actions:SyncingCompletedThreads"
            },
            "target": {
                "id": "TaskList !Actions:ThreadsFetched"
            },
            "id": "TaskList !Actions:SyncingCompletedThreads-TaskList !Actions:ThreadsFetched-0",
            "labels": [
                {
                    "id": "TaskList !Actions:SyncingCompletedThreads-TaskList !Actions:ThreadsFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Actions:CompletedThreadsSynced"
            },
            "target": {
                "id": "TaskList !Actions:SyncingCompletedThreads"
            },
            "id": "TaskList !Actions:CompletedThreadsSynced-TaskList !Actions:SyncingCompletedThreads-1",
            "labels": [
                {
                    "id": "TaskList !Actions:CompletedThreadsSynced-TaskList !Actions:SyncingCompletedThreads-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Actions:SyncingCompletedTasks"
            },
            "target": {
                "id": "TaskList !Actions:CompletedTasksSynced"
            },
            "id": "TaskList !Actions:SyncingCompletedTasks-TaskList !Actions:CompletedTasksSynced-1",
            "labels": [
                {
                    "id": "TaskList !Actions:SyncingCompletedTasks-TaskList !Actions:CompletedTasksSynced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Actions:SyncingCompletedTasks"
            },
            "target": {
                "id": "TaskList !Actions:Syncing"
            },
            "id": "TaskList !Actions:SyncingCompletedTasks-TaskList !Actions:Syncing-0",
            "labels": [
                {
                    "id": "TaskList !Actions:SyncingCompletedTasks-TaskList !Actions:Syncing-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Actions:SyncingCompletedTasks"
            },
            "target": {
                "id": "TaskList !Actions:TasksFetched"
            },
            "id": "TaskList !Actions:SyncingCompletedTasks-TaskList !Actions:TasksFetched-0",
            "labels": [
                {
                    "id": "TaskList !Actions:SyncingCompletedTasks-TaskList !Actions:TasksFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Actions:SyncingCompletedTasks"
            },
            "target": {
                "id": "TaskList !Actions:ThreadsFetched"
            },
            "id": "TaskList !Actions:SyncingCompletedTasks-TaskList !Actions:ThreadsFetched-0",
            "labels": [
                {
                    "id": "TaskList !Actions:SyncingCompletedTasks-TaskList !Actions:ThreadsFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Actions:CompletedTasksSynced"
            },
            "target": {
                "id": "TaskList !Actions:SyncingCompletedTasks"
            },
            "id": "TaskList !Actions:CompletedTasksSynced-TaskList !Actions:SyncingCompletedTasks-1",
            "labels": [
                {
                    "id": "TaskList !Actions:CompletedTasksSynced-TaskList !Actions:SyncingCompletedTasks-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Actions':Dirty"
            },
            "target": {
                "id": "GmailQuery '!Actions':MsgsFetched"
            },
            "id": "GmailQuery '!Actions':Dirty-GmailQuery '!Actions':MsgsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery '!Actions':Dirty-GmailQuery '!Actions':MsgsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Actions':Dirty"
            },
            "target": {
                "id": "GmailQuery '!Actions':ThreadsFetched"
            },
            "id": "GmailQuery '!Actions':Dirty-GmailQuery '!Actions':ThreadsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery '!Actions':Dirty-GmailQuery '!Actions':ThreadsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Actions':FetchingThreads"
            },
            "target": {
                "id": "GmailQuery '!Actions':ThreadsFetched"
            },
            "id": "GmailQuery '!Actions':FetchingThreads-GmailQuery '!Actions':ThreadsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery '!Actions':FetchingThreads-GmailQuery '!Actions':ThreadsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Actions':FetchingThreads"
            },
            "target": {
                "id": "GmailQuery '!Actions':Enabled"
            },
            "id": "GmailQuery '!Actions':FetchingThreads-GmailQuery '!Actions':Enabled-0",
            "labels": [
                {
                    "id": "GmailQuery '!Actions':FetchingThreads-GmailQuery '!Actions':Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Actions':ThreadsFetched"
            },
            "target": {
                "id": "GmailQuery '!Actions':FetchingThreads"
            },
            "id": "GmailQuery '!Actions':ThreadsFetched-GmailQuery '!Actions':FetchingThreads-1",
            "labels": [
                {
                    "id": "GmailQuery '!Actions':ThreadsFetched-GmailQuery '!Actions':FetchingThreads-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Actions':ThreadsFetched"
            },
            "target": {
                "id": "GmailQuery '!Actions':Enabled"
            },
            "id": "GmailQuery '!Actions':ThreadsFetched-GmailQuery '!Actions':Enabled-0",
            "labels": [
                {
                    "id": "GmailQuery '!Actions':ThreadsFetched-GmailQuery '!Actions':Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Actions':ThreadsFetched"
            },
            "target": {
                "id": "TaskList !Actions:ThreadsFetched"
            },
            "id": "GmailQuery '!Actions':ThreadsFetched-TaskList !Actions:ThreadsFetched-4",
            "labels": [
                {
                    "id": "GmailQuery '!Actions':ThreadsFetched-TaskList !Actions:ThreadsFetched-4-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "add"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Actions':FetchingMsgs"
            },
            "target": {
                "id": "GmailQuery '!Actions':MsgsFetched"
            },
            "id": "GmailQuery '!Actions':FetchingMsgs-GmailQuery '!Actions':MsgsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery '!Actions':FetchingMsgs-GmailQuery '!Actions':MsgsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Actions':FetchingMsgs"
            },
            "target": {
                "id": "GmailQuery '!Actions':Enabled"
            },
            "id": "GmailQuery '!Actions':FetchingMsgs-GmailQuery '!Actions':Enabled-0",
            "labels": [
                {
                    "id": "GmailQuery '!Actions':FetchingMsgs-GmailQuery '!Actions':Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Actions':FetchingMsgs"
            },
            "target": {
                "id": "GmailQuery '!Actions':ThreadsFetched"
            },
            "id": "GmailQuery '!Actions':FetchingMsgs-GmailQuery '!Actions':ThreadsFetched-0",
            "labels": [
                {
                    "id": "GmailQuery '!Actions':FetchingMsgs-GmailQuery '!Actions':ThreadsFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Actions':MsgsFetched"
            },
            "target": {
                "id": "GmailQuery '!Actions':FetchingMsgs"
            },
            "id": "GmailQuery '!Actions':MsgsFetched-GmailQuery '!Actions':FetchingMsgs-1",
            "labels": [
                {
                    "id": "GmailQuery '!Actions':MsgsFetched-GmailQuery '!Actions':FetchingMsgs-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Actions':MsgsFetched"
            },
            "target": {
                "id": "TaskList !Actions:MsgsFetched"
            },
            "id": "GmailQuery '!Actions':MsgsFetched-TaskList !Actions:MsgsFetched-4",
            "labels": [
                {
                    "id": "GmailQuery '!Actions':MsgsFetched-TaskList !Actions:MsgsFetched-4-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "add"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Actions:Enabled"
            },
            "target": {
                "id": "GmailQuery '!Actions':Enabled"
            },
            "id": "TaskList !Actions:Enabled-GmailQuery '!Actions':Enabled-4",
            "labels": [
                {
                    "id": "TaskList !Actions:Enabled-GmailQuery '!Actions':Enabled-4-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "add"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Waiting:Syncing"
            },
            "target": {
                "id": "TaskList !Waiting:Synced"
            },
            "id": "TaskList !Waiting:Syncing-TaskList !Waiting:Synced-1",
            "labels": [
                {
                    "id": "TaskList !Waiting:Syncing-TaskList !Waiting:Synced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Waiting:Syncing"
            },
            "target": {
                "id": "TaskList !Waiting:Restart"
            },
            "id": "TaskList !Waiting:Syncing-TaskList !Waiting:Restart-1",
            "labels": [
                {
                    "id": "TaskList !Waiting:Syncing-TaskList !Waiting:Restart-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Waiting:Syncing"
            },
            "target": {
                "id": "TaskList !Waiting:Enabled"
            },
            "id": "TaskList !Waiting:Syncing-TaskList !Waiting:Enabled-0",
            "labels": [
                {
                    "id": "TaskList !Waiting:Syncing-TaskList !Waiting:Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Waiting:Syncing"
            },
            "target": {
                "id": "Sync:SyncingTaskLists"
            },
            "id": "TaskList !Waiting:Syncing-Sync:SyncingTaskLists-4",
            "labels": [
                {
                    "id": "TaskList !Waiting:Syncing-Sync:SyncingTaskLists-4-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "add"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Waiting:Synced"
            },
            "target": {
                "id": "TaskList !Waiting:Syncing"
            },
            "id": "TaskList !Waiting:Synced-TaskList !Waiting:Syncing-1",
            "labels": [
                {
                    "id": "TaskList !Waiting:Synced-TaskList !Waiting:Syncing-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Waiting:Synced"
            },
            "target": {
                "id": "TaskList !Waiting:CompletedTasksSynced"
            },
            "id": "TaskList !Waiting:Synced-TaskList !Waiting:CompletedTasksSynced-0",
            "labels": [
                {
                    "id": "TaskList !Waiting:Synced-TaskList !Waiting:CompletedTasksSynced-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Waiting:Synced"
            },
            "target": {
                "id": "TaskList !Waiting:ThreadsToTasksSynced"
            },
            "id": "TaskList !Waiting:Synced-TaskList !Waiting:ThreadsToTasksSynced-0",
            "labels": [
                {
                    "id": "TaskList !Waiting:Synced-TaskList !Waiting:ThreadsToTasksSynced-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Waiting:Synced"
            },
            "target": {
                "id": "TaskList !Waiting:TasksToThreadsSynced"
            },
            "id": "TaskList !Waiting:Synced-TaskList !Waiting:TasksToThreadsSynced-0",
            "labels": [
                {
                    "id": "TaskList !Waiting:Synced-TaskList !Waiting:TasksToThreadsSynced-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Waiting:Synced"
            },
            "target": {
                "id": "TaskList !Waiting:CompletedThreadsSynced"
            },
            "id": "TaskList !Waiting:Synced-TaskList !Waiting:CompletedThreadsSynced-0",
            "labels": [
                {
                    "id": "TaskList !Waiting:Synced-TaskList !Waiting:CompletedThreadsSynced-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Waiting:Synced"
            },
            "target": {
                "id": "Sync:TaskListsSynced"
            },
            "id": "TaskList !Waiting:Synced-Sync:TaskListsSynced-4",
            "labels": [
                {
                    "id": "TaskList !Waiting:Synced-Sync:TaskListsSynced-4-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "add"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Waiting:Restart"
            },
            "target": {
                "id": "TaskList !Waiting:TasksFetched"
            },
            "id": "TaskList !Waiting:Restart-TaskList !Waiting:TasksFetched-1",
            "labels": [
                {
                    "id": "TaskList !Waiting:Restart-TaskList !Waiting:TasksFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Waiting:Restart"
            },
            "target": {
                "id": "TaskList !Waiting:CompletedTasksSynced"
            },
            "id": "TaskList !Waiting:Restart-TaskList !Waiting:CompletedTasksSynced-1",
            "labels": [
                {
                    "id": "TaskList !Waiting:Restart-TaskList !Waiting:CompletedTasksSynced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Waiting:Restart"
            },
            "target": {
                "id": "TaskList !Waiting:ThreadsToTasksSynced"
            },
            "id": "TaskList !Waiting:Restart-TaskList !Waiting:ThreadsToTasksSynced-1",
            "labels": [
                {
                    "id": "TaskList !Waiting:Restart-TaskList !Waiting:ThreadsToTasksSynced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Waiting:Restart"
            },
            "target": {
                "id": "TaskList !Waiting:TasksToThreadsSynced"
            },
            "id": "TaskList !Waiting:Restart-TaskList !Waiting:TasksToThreadsSynced-1",
            "labels": [
                {
                    "id": "TaskList !Waiting:Restart-TaskList !Waiting:TasksToThreadsSynced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Waiting:Restart"
            },
            "target": {
                "id": "TaskList !Waiting:CompletedThreadsSynced"
            },
            "id": "TaskList !Waiting:Restart-TaskList !Waiting:CompletedThreadsSynced-1",
            "labels": [
                {
                    "id": "TaskList !Waiting:Restart-TaskList !Waiting:CompletedThreadsSynced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Waiting:Restart"
            },
            "target": {
                "id": "TaskList !Waiting:TasksCached"
            },
            "id": "TaskList !Waiting:Restart-TaskList !Waiting:TasksCached-1",
            "labels": [
                {
                    "id": "TaskList !Waiting:Restart-TaskList !Waiting:TasksCached-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Waiting:PreparingList"
            },
            "target": {
                "id": "TaskList !Waiting:ListReady"
            },
            "id": "TaskList !Waiting:PreparingList-TaskList !Waiting:ListReady-1",
            "labels": [
                {
                    "id": "TaskList !Waiting:PreparingList-TaskList !Waiting:ListReady-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Waiting:PreparingList"
            },
            "target": {
                "id": "TaskList !Waiting:Syncing"
            },
            "id": "TaskList !Waiting:PreparingList-TaskList !Waiting:Syncing-0",
            "labels": [
                {
                    "id": "TaskList !Waiting:PreparingList-TaskList !Waiting:Syncing-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Waiting:ListReady"
            },
            "target": {
                "id": "TaskList !Waiting:PreparingList"
            },
            "id": "TaskList !Waiting:ListReady-TaskList !Waiting:PreparingList-1",
            "labels": [
                {
                    "id": "TaskList !Waiting:ListReady-TaskList !Waiting:PreparingList-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Waiting:FetchingTasks"
            },
            "target": {
                "id": "TaskList !Waiting:TasksFetched"
            },
            "id": "TaskList !Waiting:FetchingTasks-TaskList !Waiting:TasksFetched-1",
            "labels": [
                {
                    "id": "TaskList !Waiting:FetchingTasks-TaskList !Waiting:TasksFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Waiting:FetchingTasks"
            },
            "target": {
                "id": "TaskList !Waiting:Syncing"
            },
            "id": "TaskList !Waiting:FetchingTasks-TaskList !Waiting:Syncing-0",
            "labels": [
                {
                    "id": "TaskList !Waiting:FetchingTasks-TaskList !Waiting:Syncing-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Waiting:FetchingTasks"
            },
            "target": {
                "id": "TaskList !Waiting:ListReady"
            },
            "id": "TaskList !Waiting:FetchingTasks-TaskList !Waiting:ListReady-0",
            "labels": [
                {
                    "id": "TaskList !Waiting:FetchingTasks-TaskList !Waiting:ListReady-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Waiting:TasksFetched"
            },
            "target": {
                "id": "TaskList !Waiting:FetchingTasks"
            },
            "id": "TaskList !Waiting:TasksFetched-TaskList !Waiting:FetchingTasks-1",
            "labels": [
                {
                    "id": "TaskList !Waiting:TasksFetched-TaskList !Waiting:FetchingTasks-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Waiting:TasksFetched"
            },
            "target": {
                "id": "TaskList !Waiting:ListReady"
            },
            "id": "TaskList !Waiting:TasksFetched-TaskList !Waiting:ListReady-0",
            "labels": [
                {
                    "id": "TaskList !Waiting:TasksFetched-TaskList !Waiting:ListReady-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Waiting:SyncingThreadsToTasks"
            },
            "target": {
                "id": "TaskList !Waiting:ThreadsToTasksSynced"
            },
            "id": "TaskList !Waiting:SyncingThreadsToTasks-TaskList !Waiting:ThreadsToTasksSynced-1",
            "labels": [
                {
                    "id": "TaskList !Waiting:SyncingThreadsToTasks-TaskList !Waiting:ThreadsToTasksSynced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Waiting:SyncingThreadsToTasks"
            },
            "target": {
                "id": "TaskList !Waiting:Syncing"
            },
            "id": "TaskList !Waiting:SyncingThreadsToTasks-TaskList !Waiting:Syncing-0",
            "labels": [
                {
                    "id": "TaskList !Waiting:SyncingThreadsToTasks-TaskList !Waiting:Syncing-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Waiting:SyncingThreadsToTasks"
            },
            "target": {
                "id": "TaskList !Waiting:TasksFetched"
            },
            "id": "TaskList !Waiting:SyncingThreadsToTasks-TaskList !Waiting:TasksFetched-0",
            "labels": [
                {
                    "id": "TaskList !Waiting:SyncingThreadsToTasks-TaskList !Waiting:TasksFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Waiting:SyncingThreadsToTasks"
            },
            "target": {
                "id": "TaskList !Waiting:MsgsFetched"
            },
            "id": "TaskList !Waiting:SyncingThreadsToTasks-TaskList !Waiting:MsgsFetched-0",
            "labels": [
                {
                    "id": "TaskList !Waiting:SyncingThreadsToTasks-TaskList !Waiting:MsgsFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Waiting:ThreadsToTasksSynced"
            },
            "target": {
                "id": "TaskList !Waiting:SyncingThreadsToTasks"
            },
            "id": "TaskList !Waiting:ThreadsToTasksSynced-TaskList !Waiting:SyncingThreadsToTasks-1",
            "labels": [
                {
                    "id": "TaskList !Waiting:ThreadsToTasksSynced-TaskList !Waiting:SyncingThreadsToTasks-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Waiting:SyncingTasksToThreads"
            },
            "target": {
                "id": "TaskList !Waiting:TasksToThreadsSynced"
            },
            "id": "TaskList !Waiting:SyncingTasksToThreads-TaskList !Waiting:TasksToThreadsSynced-1",
            "labels": [
                {
                    "id": "TaskList !Waiting:SyncingTasksToThreads-TaskList !Waiting:TasksToThreadsSynced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Waiting:SyncingTasksToThreads"
            },
            "target": {
                "id": "TaskList !Waiting:Syncing"
            },
            "id": "TaskList !Waiting:SyncingTasksToThreads-TaskList !Waiting:Syncing-0",
            "labels": [
                {
                    "id": "TaskList !Waiting:SyncingTasksToThreads-TaskList !Waiting:Syncing-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Waiting:SyncingTasksToThreads"
            },
            "target": {
                "id": "TaskList !Waiting:TasksFetched"
            },
            "id": "TaskList !Waiting:SyncingTasksToThreads-TaskList !Waiting:TasksFetched-0",
            "labels": [
                {
                    "id": "TaskList !Waiting:SyncingTasksToThreads-TaskList !Waiting:TasksFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Waiting:SyncingTasksToThreads"
            },
            "target": {
                "id": "TaskList !Waiting:ThreadsFetched"
            },
            "id": "TaskList !Waiting:SyncingTasksToThreads-TaskList !Waiting:ThreadsFetched-0",
            "labels": [
                {
                    "id": "TaskList !Waiting:SyncingTasksToThreads-TaskList !Waiting:ThreadsFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Waiting:TasksToThreadsSynced"
            },
            "target": {
                "id": "TaskList !Waiting:SyncingTasksToThreads"
            },
            "id": "TaskList !Waiting:TasksToThreadsSynced-TaskList !Waiting:SyncingTasksToThreads-1",
            "labels": [
                {
                    "id": "TaskList !Waiting:TasksToThreadsSynced-TaskList !Waiting:SyncingTasksToThreads-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Waiting:SyncingCompletedThreads"
            },
            "target": {
                "id": "TaskList !Waiting:CompletedThreadsSynced"
            },
            "id": "TaskList !Waiting:SyncingCompletedThreads-TaskList !Waiting:CompletedThreadsSynced-1",
            "labels": [
                {
                    "id": "TaskList !Waiting:SyncingCompletedThreads-TaskList !Waiting:CompletedThreadsSynced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Waiting:SyncingCompletedThreads"
            },
            "target": {
                "id": "TaskList !Waiting:Syncing"
            },
            "id": "TaskList !Waiting:SyncingCompletedThreads-TaskList !Waiting:Syncing-0",
            "labels": [
                {
                    "id": "TaskList !Waiting:SyncingCompletedThreads-TaskList !Waiting:Syncing-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Waiting:SyncingCompletedThreads"
            },
            "target": {
                "id": "TaskList !Waiting:TasksFetched"
            },
            "id": "TaskList !Waiting:SyncingCompletedThreads-TaskList !Waiting:TasksFetched-0",
            "labels": [
                {
                    "id": "TaskList !Waiting:SyncingCompletedThreads-TaskList !Waiting:TasksFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Waiting:SyncingCompletedThreads"
            },
            "target": {
                "id": "TaskList !Waiting:ThreadsFetched"
            },
            "id": "TaskList !Waiting:SyncingCompletedThreads-TaskList !Waiting:ThreadsFetched-0",
            "labels": [
                {
                    "id": "TaskList !Waiting:SyncingCompletedThreads-TaskList !Waiting:ThreadsFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Waiting:CompletedThreadsSynced"
            },
            "target": {
                "id": "TaskList !Waiting:SyncingCompletedThreads"
            },
            "id": "TaskList !Waiting:CompletedThreadsSynced-TaskList !Waiting:SyncingCompletedThreads-1",
            "labels": [
                {
                    "id": "TaskList !Waiting:CompletedThreadsSynced-TaskList !Waiting:SyncingCompletedThreads-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Waiting:SyncingCompletedTasks"
            },
            "target": {
                "id": "TaskList !Waiting:CompletedTasksSynced"
            },
            "id": "TaskList !Waiting:SyncingCompletedTasks-TaskList !Waiting:CompletedTasksSynced-1",
            "labels": [
                {
                    "id": "TaskList !Waiting:SyncingCompletedTasks-TaskList !Waiting:CompletedTasksSynced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Waiting:SyncingCompletedTasks"
            },
            "target": {
                "id": "TaskList !Waiting:Syncing"
            },
            "id": "TaskList !Waiting:SyncingCompletedTasks-TaskList !Waiting:Syncing-0",
            "labels": [
                {
                    "id": "TaskList !Waiting:SyncingCompletedTasks-TaskList !Waiting:Syncing-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Waiting:SyncingCompletedTasks"
            },
            "target": {
                "id": "TaskList !Waiting:TasksFetched"
            },
            "id": "TaskList !Waiting:SyncingCompletedTasks-TaskList !Waiting:TasksFetched-0",
            "labels": [
                {
                    "id": "TaskList !Waiting:SyncingCompletedTasks-TaskList !Waiting:TasksFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Waiting:SyncingCompletedTasks"
            },
            "target": {
                "id": "TaskList !Waiting:ThreadsFetched"
            },
            "id": "TaskList !Waiting:SyncingCompletedTasks-TaskList !Waiting:ThreadsFetched-0",
            "labels": [
                {
                    "id": "TaskList !Waiting:SyncingCompletedTasks-TaskList !Waiting:ThreadsFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Waiting:CompletedTasksSynced"
            },
            "target": {
                "id": "TaskList !Waiting:SyncingCompletedTasks"
            },
            "id": "TaskList !Waiting:CompletedTasksSynced-TaskList !Waiting:SyncingCompletedTasks-1",
            "labels": [
                {
                    "id": "TaskList !Waiting:CompletedTasksSynced-TaskList !Waiting:SyncingCompletedTasks-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Waiting':Dirty"
            },
            "target": {
                "id": "GmailQuery '!Waiting':MsgsFetched"
            },
            "id": "GmailQuery '!Waiting':Dirty-GmailQuery '!Waiting':MsgsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery '!Waiting':Dirty-GmailQuery '!Waiting':MsgsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Waiting':Dirty"
            },
            "target": {
                "id": "GmailQuery '!Waiting':ThreadsFetched"
            },
            "id": "GmailQuery '!Waiting':Dirty-GmailQuery '!Waiting':ThreadsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery '!Waiting':Dirty-GmailQuery '!Waiting':ThreadsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Waiting':FetchingThreads"
            },
            "target": {
                "id": "GmailQuery '!Waiting':ThreadsFetched"
            },
            "id": "GmailQuery '!Waiting':FetchingThreads-GmailQuery '!Waiting':ThreadsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery '!Waiting':FetchingThreads-GmailQuery '!Waiting':ThreadsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Waiting':FetchingThreads"
            },
            "target": {
                "id": "GmailQuery '!Waiting':Enabled"
            },
            "id": "GmailQuery '!Waiting':FetchingThreads-GmailQuery '!Waiting':Enabled-0",
            "labels": [
                {
                    "id": "GmailQuery '!Waiting':FetchingThreads-GmailQuery '!Waiting':Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Waiting':ThreadsFetched"
            },
            "target": {
                "id": "GmailQuery '!Waiting':FetchingThreads"
            },
            "id": "GmailQuery '!Waiting':ThreadsFetched-GmailQuery '!Waiting':FetchingThreads-1",
            "labels": [
                {
                    "id": "GmailQuery '!Waiting':ThreadsFetched-GmailQuery '!Waiting':FetchingThreads-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Waiting':ThreadsFetched"
            },
            "target": {
                "id": "GmailQuery '!Waiting':Enabled"
            },
            "id": "GmailQuery '!Waiting':ThreadsFetched-GmailQuery '!Waiting':Enabled-0",
            "labels": [
                {
                    "id": "GmailQuery '!Waiting':ThreadsFetched-GmailQuery '!Waiting':Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Waiting':ThreadsFetched"
            },
            "target": {
                "id": "TaskList !Waiting:ThreadsFetched"
            },
            "id": "GmailQuery '!Waiting':ThreadsFetched-TaskList !Waiting:ThreadsFetched-4",
            "labels": [
                {
                    "id": "GmailQuery '!Waiting':ThreadsFetched-TaskList !Waiting:ThreadsFetched-4-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "add"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Waiting':FetchingMsgs"
            },
            "target": {
                "id": "GmailQuery '!Waiting':MsgsFetched"
            },
            "id": "GmailQuery '!Waiting':FetchingMsgs-GmailQuery '!Waiting':MsgsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery '!Waiting':FetchingMsgs-GmailQuery '!Waiting':MsgsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Waiting':FetchingMsgs"
            },
            "target": {
                "id": "GmailQuery '!Waiting':Enabled"
            },
            "id": "GmailQuery '!Waiting':FetchingMsgs-GmailQuery '!Waiting':Enabled-0",
            "labels": [
                {
                    "id": "GmailQuery '!Waiting':FetchingMsgs-GmailQuery '!Waiting':Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Waiting':FetchingMsgs"
            },
            "target": {
                "id": "GmailQuery '!Waiting':ThreadsFetched"
            },
            "id": "GmailQuery '!Waiting':FetchingMsgs-GmailQuery '!Waiting':ThreadsFetched-0",
            "labels": [
                {
                    "id": "GmailQuery '!Waiting':FetchingMsgs-GmailQuery '!Waiting':ThreadsFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Waiting':MsgsFetched"
            },
            "target": {
                "id": "GmailQuery '!Waiting':FetchingMsgs"
            },
            "id": "GmailQuery '!Waiting':MsgsFetched-GmailQuery '!Waiting':FetchingMsgs-1",
            "labels": [
                {
                    "id": "GmailQuery '!Waiting':MsgsFetched-GmailQuery '!Waiting':FetchingMsgs-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Waiting':MsgsFetched"
            },
            "target": {
                "id": "TaskList !Waiting:MsgsFetched"
            },
            "id": "GmailQuery '!Waiting':MsgsFetched-TaskList !Waiting:MsgsFetched-4",
            "labels": [
                {
                    "id": "GmailQuery '!Waiting':MsgsFetched-TaskList !Waiting:MsgsFetched-4-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "add"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Waiting:Enabled"
            },
            "target": {
                "id": "GmailQuery '!Waiting':Enabled"
            },
            "id": "TaskList !Waiting:Enabled-GmailQuery '!Waiting':Enabled-4",
            "labels": [
                {
                    "id": "TaskList !Waiting:Enabled-GmailQuery '!Waiting':Enabled-4-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "add"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Someday:Syncing"
            },
            "target": {
                "id": "TaskList !Someday:Synced"
            },
            "id": "TaskList !Someday:Syncing-TaskList !Someday:Synced-1",
            "labels": [
                {
                    "id": "TaskList !Someday:Syncing-TaskList !Someday:Synced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Someday:Syncing"
            },
            "target": {
                "id": "TaskList !Someday:Restart"
            },
            "id": "TaskList !Someday:Syncing-TaskList !Someday:Restart-1",
            "labels": [
                {
                    "id": "TaskList !Someday:Syncing-TaskList !Someday:Restart-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Someday:Syncing"
            },
            "target": {
                "id": "TaskList !Someday:Enabled"
            },
            "id": "TaskList !Someday:Syncing-TaskList !Someday:Enabled-0",
            "labels": [
                {
                    "id": "TaskList !Someday:Syncing-TaskList !Someday:Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Someday:Syncing"
            },
            "target": {
                "id": "Sync:SyncingTaskLists"
            },
            "id": "TaskList !Someday:Syncing-Sync:SyncingTaskLists-4",
            "labels": [
                {
                    "id": "TaskList !Someday:Syncing-Sync:SyncingTaskLists-4-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "add"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Someday:Synced"
            },
            "target": {
                "id": "TaskList !Someday:Syncing"
            },
            "id": "TaskList !Someday:Synced-TaskList !Someday:Syncing-1",
            "labels": [
                {
                    "id": "TaskList !Someday:Synced-TaskList !Someday:Syncing-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Someday:Synced"
            },
            "target": {
                "id": "TaskList !Someday:CompletedTasksSynced"
            },
            "id": "TaskList !Someday:Synced-TaskList !Someday:CompletedTasksSynced-0",
            "labels": [
                {
                    "id": "TaskList !Someday:Synced-TaskList !Someday:CompletedTasksSynced-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Someday:Synced"
            },
            "target": {
                "id": "TaskList !Someday:ThreadsToTasksSynced"
            },
            "id": "TaskList !Someday:Synced-TaskList !Someday:ThreadsToTasksSynced-0",
            "labels": [
                {
                    "id": "TaskList !Someday:Synced-TaskList !Someday:ThreadsToTasksSynced-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Someday:Synced"
            },
            "target": {
                "id": "TaskList !Someday:TasksToThreadsSynced"
            },
            "id": "TaskList !Someday:Synced-TaskList !Someday:TasksToThreadsSynced-0",
            "labels": [
                {
                    "id": "TaskList !Someday:Synced-TaskList !Someday:TasksToThreadsSynced-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Someday:Synced"
            },
            "target": {
                "id": "TaskList !Someday:CompletedThreadsSynced"
            },
            "id": "TaskList !Someday:Synced-TaskList !Someday:CompletedThreadsSynced-0",
            "labels": [
                {
                    "id": "TaskList !Someday:Synced-TaskList !Someday:CompletedThreadsSynced-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Someday:Synced"
            },
            "target": {
                "id": "Sync:TaskListsSynced"
            },
            "id": "TaskList !Someday:Synced-Sync:TaskListsSynced-4",
            "labels": [
                {
                    "id": "TaskList !Someday:Synced-Sync:TaskListsSynced-4-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "add"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Someday:Restart"
            },
            "target": {
                "id": "TaskList !Someday:TasksFetched"
            },
            "id": "TaskList !Someday:Restart-TaskList !Someday:TasksFetched-1",
            "labels": [
                {
                    "id": "TaskList !Someday:Restart-TaskList !Someday:TasksFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Someday:Restart"
            },
            "target": {
                "id": "TaskList !Someday:CompletedTasksSynced"
            },
            "id": "TaskList !Someday:Restart-TaskList !Someday:CompletedTasksSynced-1",
            "labels": [
                {
                    "id": "TaskList !Someday:Restart-TaskList !Someday:CompletedTasksSynced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Someday:Restart"
            },
            "target": {
                "id": "TaskList !Someday:ThreadsToTasksSynced"
            },
            "id": "TaskList !Someday:Restart-TaskList !Someday:ThreadsToTasksSynced-1",
            "labels": [
                {
                    "id": "TaskList !Someday:Restart-TaskList !Someday:ThreadsToTasksSynced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Someday:Restart"
            },
            "target": {
                "id": "TaskList !Someday:TasksToThreadsSynced"
            },
            "id": "TaskList !Someday:Restart-TaskList !Someday:TasksToThreadsSynced-1",
            "labels": [
                {
                    "id": "TaskList !Someday:Restart-TaskList !Someday:TasksToThreadsSynced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Someday:Restart"
            },
            "target": {
                "id": "TaskList !Someday:CompletedThreadsSynced"
            },
            "id": "TaskList !Someday:Restart-TaskList !Someday:CompletedThreadsSynced-1",
            "labels": [
                {
                    "id": "TaskList !Someday:Restart-TaskList !Someday:CompletedThreadsSynced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Someday:Restart"
            },
            "target": {
                "id": "TaskList !Someday:TasksCached"
            },
            "id": "TaskList !Someday:Restart-TaskList !Someday:TasksCached-1",
            "labels": [
                {
                    "id": "TaskList !Someday:Restart-TaskList !Someday:TasksCached-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Someday:PreparingList"
            },
            "target": {
                "id": "TaskList !Someday:ListReady"
            },
            "id": "TaskList !Someday:PreparingList-TaskList !Someday:ListReady-1",
            "labels": [
                {
                    "id": "TaskList !Someday:PreparingList-TaskList !Someday:ListReady-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Someday:PreparingList"
            },
            "target": {
                "id": "TaskList !Someday:Syncing"
            },
            "id": "TaskList !Someday:PreparingList-TaskList !Someday:Syncing-0",
            "labels": [
                {
                    "id": "TaskList !Someday:PreparingList-TaskList !Someday:Syncing-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Someday:ListReady"
            },
            "target": {
                "id": "TaskList !Someday:PreparingList"
            },
            "id": "TaskList !Someday:ListReady-TaskList !Someday:PreparingList-1",
            "labels": [
                {
                    "id": "TaskList !Someday:ListReady-TaskList !Someday:PreparingList-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Someday:FetchingTasks"
            },
            "target": {
                "id": "TaskList !Someday:TasksFetched"
            },
            "id": "TaskList !Someday:FetchingTasks-TaskList !Someday:TasksFetched-1",
            "labels": [
                {
                    "id": "TaskList !Someday:FetchingTasks-TaskList !Someday:TasksFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Someday:FetchingTasks"
            },
            "target": {
                "id": "TaskList !Someday:Syncing"
            },
            "id": "TaskList !Someday:FetchingTasks-TaskList !Someday:Syncing-0",
            "labels": [
                {
                    "id": "TaskList !Someday:FetchingTasks-TaskList !Someday:Syncing-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Someday:FetchingTasks"
            },
            "target": {
                "id": "TaskList !Someday:ListReady"
            },
            "id": "TaskList !Someday:FetchingTasks-TaskList !Someday:ListReady-0",
            "labels": [
                {
                    "id": "TaskList !Someday:FetchingTasks-TaskList !Someday:ListReady-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Someday:TasksFetched"
            },
            "target": {
                "id": "TaskList !Someday:FetchingTasks"
            },
            "id": "TaskList !Someday:TasksFetched-TaskList !Someday:FetchingTasks-1",
            "labels": [
                {
                    "id": "TaskList !Someday:TasksFetched-TaskList !Someday:FetchingTasks-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Someday:TasksFetched"
            },
            "target": {
                "id": "TaskList !Someday:ListReady"
            },
            "id": "TaskList !Someday:TasksFetched-TaskList !Someday:ListReady-0",
            "labels": [
                {
                    "id": "TaskList !Someday:TasksFetched-TaskList !Someday:ListReady-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Someday:SyncingThreadsToTasks"
            },
            "target": {
                "id": "TaskList !Someday:ThreadsToTasksSynced"
            },
            "id": "TaskList !Someday:SyncingThreadsToTasks-TaskList !Someday:ThreadsToTasksSynced-1",
            "labels": [
                {
                    "id": "TaskList !Someday:SyncingThreadsToTasks-TaskList !Someday:ThreadsToTasksSynced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Someday:SyncingThreadsToTasks"
            },
            "target": {
                "id": "TaskList !Someday:Syncing"
            },
            "id": "TaskList !Someday:SyncingThreadsToTasks-TaskList !Someday:Syncing-0",
            "labels": [
                {
                    "id": "TaskList !Someday:SyncingThreadsToTasks-TaskList !Someday:Syncing-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Someday:SyncingThreadsToTasks"
            },
            "target": {
                "id": "TaskList !Someday:TasksFetched"
            },
            "id": "TaskList !Someday:SyncingThreadsToTasks-TaskList !Someday:TasksFetched-0",
            "labels": [
                {
                    "id": "TaskList !Someday:SyncingThreadsToTasks-TaskList !Someday:TasksFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Someday:SyncingThreadsToTasks"
            },
            "target": {
                "id": "TaskList !Someday:MsgsFetched"
            },
            "id": "TaskList !Someday:SyncingThreadsToTasks-TaskList !Someday:MsgsFetched-0",
            "labels": [
                {
                    "id": "TaskList !Someday:SyncingThreadsToTasks-TaskList !Someday:MsgsFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Someday:ThreadsToTasksSynced"
            },
            "target": {
                "id": "TaskList !Someday:SyncingThreadsToTasks"
            },
            "id": "TaskList !Someday:ThreadsToTasksSynced-TaskList !Someday:SyncingThreadsToTasks-1",
            "labels": [
                {
                    "id": "TaskList !Someday:ThreadsToTasksSynced-TaskList !Someday:SyncingThreadsToTasks-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Someday:SyncingTasksToThreads"
            },
            "target": {
                "id": "TaskList !Someday:TasksToThreadsSynced"
            },
            "id": "TaskList !Someday:SyncingTasksToThreads-TaskList !Someday:TasksToThreadsSynced-1",
            "labels": [
                {
                    "id": "TaskList !Someday:SyncingTasksToThreads-TaskList !Someday:TasksToThreadsSynced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Someday:SyncingTasksToThreads"
            },
            "target": {
                "id": "TaskList !Someday:Syncing"
            },
            "id": "TaskList !Someday:SyncingTasksToThreads-TaskList !Someday:Syncing-0",
            "labels": [
                {
                    "id": "TaskList !Someday:SyncingTasksToThreads-TaskList !Someday:Syncing-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Someday:SyncingTasksToThreads"
            },
            "target": {
                "id": "TaskList !Someday:TasksFetched"
            },
            "id": "TaskList !Someday:SyncingTasksToThreads-TaskList !Someday:TasksFetched-0",
            "labels": [
                {
                    "id": "TaskList !Someday:SyncingTasksToThreads-TaskList !Someday:TasksFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Someday:SyncingTasksToThreads"
            },
            "target": {
                "id": "TaskList !Someday:ThreadsFetched"
            },
            "id": "TaskList !Someday:SyncingTasksToThreads-TaskList !Someday:ThreadsFetched-0",
            "labels": [
                {
                    "id": "TaskList !Someday:SyncingTasksToThreads-TaskList !Someday:ThreadsFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Someday:TasksToThreadsSynced"
            },
            "target": {
                "id": "TaskList !Someday:SyncingTasksToThreads"
            },
            "id": "TaskList !Someday:TasksToThreadsSynced-TaskList !Someday:SyncingTasksToThreads-1",
            "labels": [
                {
                    "id": "TaskList !Someday:TasksToThreadsSynced-TaskList !Someday:SyncingTasksToThreads-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Someday:SyncingCompletedThreads"
            },
            "target": {
                "id": "TaskList !Someday:CompletedThreadsSynced"
            },
            "id": "TaskList !Someday:SyncingCompletedThreads-TaskList !Someday:CompletedThreadsSynced-1",
            "labels": [
                {
                    "id": "TaskList !Someday:SyncingCompletedThreads-TaskList !Someday:CompletedThreadsSynced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Someday:SyncingCompletedThreads"
            },
            "target": {
                "id": "TaskList !Someday:Syncing"
            },
            "id": "TaskList !Someday:SyncingCompletedThreads-TaskList !Someday:Syncing-0",
            "labels": [
                {
                    "id": "TaskList !Someday:SyncingCompletedThreads-TaskList !Someday:Syncing-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Someday:SyncingCompletedThreads"
            },
            "target": {
                "id": "TaskList !Someday:TasksFetched"
            },
            "id": "TaskList !Someday:SyncingCompletedThreads-TaskList !Someday:TasksFetched-0",
            "labels": [
                {
                    "id": "TaskList !Someday:SyncingCompletedThreads-TaskList !Someday:TasksFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Someday:SyncingCompletedThreads"
            },
            "target": {
                "id": "TaskList !Someday:ThreadsFetched"
            },
            "id": "TaskList !Someday:SyncingCompletedThreads-TaskList !Someday:ThreadsFetched-0",
            "labels": [
                {
                    "id": "TaskList !Someday:SyncingCompletedThreads-TaskList !Someday:ThreadsFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Someday:CompletedThreadsSynced"
            },
            "target": {
                "id": "TaskList !Someday:SyncingCompletedThreads"
            },
            "id": "TaskList !Someday:CompletedThreadsSynced-TaskList !Someday:SyncingCompletedThreads-1",
            "labels": [
                {
                    "id": "TaskList !Someday:CompletedThreadsSynced-TaskList !Someday:SyncingCompletedThreads-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Someday:SyncingCompletedTasks"
            },
            "target": {
                "id": "TaskList !Someday:CompletedTasksSynced"
            },
            "id": "TaskList !Someday:SyncingCompletedTasks-TaskList !Someday:CompletedTasksSynced-1",
            "labels": [
                {
                    "id": "TaskList !Someday:SyncingCompletedTasks-TaskList !Someday:CompletedTasksSynced-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Someday:SyncingCompletedTasks"
            },
            "target": {
                "id": "TaskList !Someday:Syncing"
            },
            "id": "TaskList !Someday:SyncingCompletedTasks-TaskList !Someday:Syncing-0",
            "labels": [
                {
                    "id": "TaskList !Someday:SyncingCompletedTasks-TaskList !Someday:Syncing-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Someday:SyncingCompletedTasks"
            },
            "target": {
                "id": "TaskList !Someday:TasksFetched"
            },
            "id": "TaskList !Someday:SyncingCompletedTasks-TaskList !Someday:TasksFetched-0",
            "labels": [
                {
                    "id": "TaskList !Someday:SyncingCompletedTasks-TaskList !Someday:TasksFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Someday:SyncingCompletedTasks"
            },
            "target": {
                "id": "TaskList !Someday:ThreadsFetched"
            },
            "id": "TaskList !Someday:SyncingCompletedTasks-TaskList !Someday:ThreadsFetched-0",
            "labels": [
                {
                    "id": "TaskList !Someday:SyncingCompletedTasks-TaskList !Someday:ThreadsFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Someday:CompletedTasksSynced"
            },
            "target": {
                "id": "TaskList !Someday:SyncingCompletedTasks"
            },
            "id": "TaskList !Someday:CompletedTasksSynced-TaskList !Someday:SyncingCompletedTasks-1",
            "labels": [
                {
                    "id": "TaskList !Someday:CompletedTasksSynced-TaskList !Someday:SyncingCompletedTasks-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Someday':Dirty"
            },
            "target": {
                "id": "GmailQuery '!Someday':MsgsFetched"
            },
            "id": "GmailQuery '!Someday':Dirty-GmailQuery '!Someday':MsgsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery '!Someday':Dirty-GmailQuery '!Someday':MsgsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Someday':Dirty"
            },
            "target": {
                "id": "GmailQuery '!Someday':ThreadsFetched"
            },
            "id": "GmailQuery '!Someday':Dirty-GmailQuery '!Someday':ThreadsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery '!Someday':Dirty-GmailQuery '!Someday':ThreadsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Someday':FetchingThreads"
            },
            "target": {
                "id": "GmailQuery '!Someday':ThreadsFetched"
            },
            "id": "GmailQuery '!Someday':FetchingThreads-GmailQuery '!Someday':ThreadsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery '!Someday':FetchingThreads-GmailQuery '!Someday':ThreadsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Someday':FetchingThreads"
            },
            "target": {
                "id": "GmailQuery '!Someday':Enabled"
            },
            "id": "GmailQuery '!Someday':FetchingThreads-GmailQuery '!Someday':Enabled-0",
            "labels": [
                {
                    "id": "GmailQuery '!Someday':FetchingThreads-GmailQuery '!Someday':Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Someday':ThreadsFetched"
            },
            "target": {
                "id": "GmailQuery '!Someday':FetchingThreads"
            },
            "id": "GmailQuery '!Someday':ThreadsFetched-GmailQuery '!Someday':FetchingThreads-1",
            "labels": [
                {
                    "id": "GmailQuery '!Someday':ThreadsFetched-GmailQuery '!Someday':FetchingThreads-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Someday':ThreadsFetched"
            },
            "target": {
                "id": "GmailQuery '!Someday':Enabled"
            },
            "id": "GmailQuery '!Someday':ThreadsFetched-GmailQuery '!Someday':Enabled-0",
            "labels": [
                {
                    "id": "GmailQuery '!Someday':ThreadsFetched-GmailQuery '!Someday':Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Someday':ThreadsFetched"
            },
            "target": {
                "id": "TaskList !Someday:ThreadsFetched"
            },
            "id": "GmailQuery '!Someday':ThreadsFetched-TaskList !Someday:ThreadsFetched-4",
            "labels": [
                {
                    "id": "GmailQuery '!Someday':ThreadsFetched-TaskList !Someday:ThreadsFetched-4-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "add"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Someday':FetchingMsgs"
            },
            "target": {
                "id": "GmailQuery '!Someday':MsgsFetched"
            },
            "id": "GmailQuery '!Someday':FetchingMsgs-GmailQuery '!Someday':MsgsFetched-1",
            "labels": [
                {
                    "id": "GmailQuery '!Someday':FetchingMsgs-GmailQuery '!Someday':MsgsFetched-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Someday':FetchingMsgs"
            },
            "target": {
                "id": "GmailQuery '!Someday':Enabled"
            },
            "id": "GmailQuery '!Someday':FetchingMsgs-GmailQuery '!Someday':Enabled-0",
            "labels": [
                {
                    "id": "GmailQuery '!Someday':FetchingMsgs-GmailQuery '!Someday':Enabled-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Someday':FetchingMsgs"
            },
            "target": {
                "id": "GmailQuery '!Someday':ThreadsFetched"
            },
            "id": "GmailQuery '!Someday':FetchingMsgs-GmailQuery '!Someday':ThreadsFetched-0",
            "labels": [
                {
                    "id": "GmailQuery '!Someday':FetchingMsgs-GmailQuery '!Someday':ThreadsFetched-0-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "require"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Someday':MsgsFetched"
            },
            "target": {
                "id": "GmailQuery '!Someday':FetchingMsgs"
            },
            "id": "GmailQuery '!Someday':MsgsFetched-GmailQuery '!Someday':FetchingMsgs-1",
            "labels": [
                {
                    "id": "GmailQuery '!Someday':MsgsFetched-GmailQuery '!Someday':FetchingMsgs-1-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "drop"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "GmailQuery '!Someday':MsgsFetched"
            },
            "target": {
                "id": "TaskList !Someday:MsgsFetched"
            },
            "id": "GmailQuery '!Someday':MsgsFetched-TaskList !Someday:MsgsFetched-4",
            "labels": [
                {
                    "id": "GmailQuery '!Someday':MsgsFetched-TaskList !Someday:MsgsFetched-4-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "add"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        },
        {
            "type": "fsa.Arrow",
            "smooth": true,
            "source": {
                "id": "TaskList !Someday:Enabled"
            },
            "target": {
                "id": "GmailQuery '!Someday':Enabled"
            },
            "id": "TaskList !Someday:Enabled-GmailQuery '!Someday':Enabled-4",
            "labels": [
                {
                    "id": "TaskList !Someday:Enabled-GmailQuery '!Someday':Enabled-4-label",
                    "position": 0.5,
                    "attrs": {
                        "text": {
                            "text": "add"
                        }
                    }
                }
            ],
            "z": 2,
            "is_touched": false
        }
    ]
}