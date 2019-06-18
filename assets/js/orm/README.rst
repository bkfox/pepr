Vuex-directives
###############

**In the future this module will be put as a separate package in order to make it
reusable.**

This module provides helpers to create Vuex stores generated from ``Model`` sub-class
and directives declared on it. A directive add functionalities to the store for the
model or a specific field.


    .. code-block:: javascript

        class MyModel extends Model {
            // Defines field level directives
            static fields = {
                // Creates an index for `MyModel.foo_bar` and add a property
                // named `foo`.
                'foo': Index({attr: 'foo_bar'}),

                // Create an index for `MyModel.bar`
                'bar': Index(),

                // MyModel.bar is a property whose value is a MyModel instance
                // whose id is present on `foo_id`.
                'bar': Reference({attr: 'foo_id', target: MyModel}),
            }

            // Define model level directives
            static directives = []
        }

        const database = new Database()
        database.register(MyModel, /** { extra model's store options } **/ );

        const store = new Vuex.store(database.store,  /** { extra store options } **/ )


TODO
====
- Record:
  - send multipart form data
- Model:
  - directives & inheritance in registered => we want fields on parent to be
    run too if not redefined
- ModelStore:
  - filter: use indexes
  - remove by lookup
  - call by lookup
- Directives:
  - access & change options at level of database store
  - Reference: reverse lookup
  - Indexer: update => remove only required keys from index
  - Index: methods from ModelStore into Index.prototype.store
  - Collection: database store level release()
  - Field: create a field whose property getter/setter can be transformed by user


