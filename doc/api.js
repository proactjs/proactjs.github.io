YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "ProAct",
        "ProAct.Actor",
        "ProAct.ActorUtil",
        "ProAct.Array",
        "ProAct.Array.Listeners",
        "ProAct.Array.Operations",
        "ProAct.ArrayCore",
        "ProAct.ArrayProperty",
        "ProAct.ArrayPropertyProvider",
        "ProAct.ArrayUtils",
        "ProAct.AutoProperty",
        "ProAct.AutoPropertyProvider",
        "ProAct.BufferedStream",
        "ProAct.Configuration",
        "ProAct.Core",
        "ProAct.DSL",
        "ProAct.DSL.ops",
        "ProAct.DSL.predefined",
        "ProAct.DSL.predefined.accumulation",
        "ProAct.DSL.predefined.filtering",
        "ProAct.DSL.predefined.mapping",
        "ProAct.DebouncingStream",
        "ProAct.DelayedStream",
        "ProAct.Event",
        "ProAct.Event.Types",
        "ProAct.Flow",
        "ProAct.ObjectCore",
        "ProAct.ObjectProperty",
        "ProAct.ObjectPropertyProvider",
        "ProAct.OpStore",
        "ProAct.OpStore.all",
        "ProAct.ProbProvider",
        "ProAct.Property",
        "ProAct.Property.Types",
        "ProAct.PropertyProvider",
        "ProAct.ProxyProperty",
        "ProAct.ProxyPropertyProvider",
        "ProAct.Queue",
        "ProAct.Queues",
        "ProAct.Registry",
        "ProAct.Registry.FunctionProvider",
        "ProAct.Registry.ProObjectProvider",
        "ProAct.Registry.ProObjectProvider.types",
        "ProAct.Registry.Provider",
        "ProAct.Registry.Provider.types",
        "ProAct.Registry.StreamProvider",
        "ProAct.Registry.StreamProvider.types",
        "ProAct.SimplePropertyProvider",
        "ProAct.SizeBufferedStream",
        "ProAct.States",
        "ProAct.Stream",
        "ProAct.SubscribableStream",
        "ProAct.ThrottlingStream",
        "ProAct.Utils",
        "ProAct.ValueEvent"
    ],
    "modules": [
        "proact-arrays",
        "proact-core",
        "proact-dsl",
        "proact-flow",
        "proact-properties",
        "proact-streams"
    ],
    "allModules": [
        {
            "displayName": "proact-arrays",
            "name": "proact-arrays",
            "description": "The `proact-arrays` module provides reactive arrays.\nAll the modification operations over arrays, like `push` for example could be listened to."
        },
        {
            "displayName": "proact-core",
            "name": "proact-core",
            "description": "The `proact-core` module provides base utilties and common functionality for all the other\nmodules of the lib."
        },
        {
            "displayName": "proact-dsl",
            "name": "proact-dsl",
            "description": "The `proact-dsl` module provides DSL for creating and managing different ProAct objects."
        },
        {
            "displayName": "proact-flow",
            "name": "proact-flow",
            "description": "The `proact-flow` provides executing functions in the right order in time.\nFunction execution can be deferred, there are priorities and turns."
        },
        {
            "displayName": "proact-properties",
            "name": "proact-properties",
            "description": "The `proact-properties` module provides stateful reactive values attached to normal JavaScript\nobject's fields."
        },
        {
            "displayName": "proact-streams",
            "name": "proact-streams",
            "description": "The `proact-streams` module provides stateless streams to the ProAct.js API.\nFRP reactive streams."
        }
    ]
} };
});