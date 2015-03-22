YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "ProAct",
        "ProAct.Actor",
        "ProAct.ActorUtil",
        "ProAct.ArrayProperty",
        "ProAct.ArrayPropertyProvider",
        "ProAct.AutoProperty",
        "ProAct.AutoPropertyProvider",
        "ProAct.BufferedStream",
        "ProAct.Configuration",
        "ProAct.Core",
        "ProAct.DebouncingStream",
        "ProAct.DelayedStream",
        "ProAct.Event",
        "ProAct.Event.Types",
        "ProAct.ObjectCore",
        "ProAct.ObjectProperty",
        "ProAct.ObjectPropertyProvider",
        "ProAct.Property",
        "ProAct.Property.Types",
        "ProAct.PropertyProvider",
        "ProAct.ProxyProperty",
        "ProAct.ProxyPropertyProvider",
        "ProAct.SimplePropertyProvider",
        "ProAct.SizeBufferedStream",
        "ProAct.States",
        "ProAct.Stream",
        "ProAct.ThrottlingStream",
        "ProAct.Utils"
    ],
    "modules": [
        "proact-core",
        "proact-properties",
        "proact-streams"
    ],
    "allModules": [
        {
            "displayName": "proact-core",
            "name": "proact-core",
            "description": "The `proact-core` module provides base utilties and common functionality for all the other\nmodules of the lib."
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