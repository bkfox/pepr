<template>
    <div class="media">
        <div class="media-content">
            <div class="level">
                <div class="level-left">
                    <strong>{{ item.owner && item.owner.title || "Anonymous" }}</strong>
                    <small :title="modifiedString">
                        &mdash; {{ modifiedString }}
                        <span v-if="item && item.created != item.modified" class="icon"
                           :title="'Created on ' + createdString + ', edited on ' + modifiedString">
                            <i class="mdi mdi-pencil-outline"></i>
                        </span>
                    </small>
                </div>
            </div>
            <div v-if="!edit">{{ item.text }}</div>
            <div v-else @done="edit=false">
                <slot name="form" :item="item">
                    <p-content-form :item="item" @done="edit=false">
                        <template v-if="$slots.formFields" v-slot:fields="{item,context,model}">
                            <slot name="formFields" :item="item" :context="context"></slot>
                        </template>
                        <template v-if="$slots.formDefault" v-slot:default="{item,context}">
                            <slot name="formDefault" :item="item" :context="context"></slot>
                        </template>
                    </p-content-form>
                </slot>
            </div>
        </div>
        <div class="media-right" v-if="allowedActions.length">
            <!-- TODO: access selector here -->
            <div class="dropdown is-hoverable is-right" aria-role="menu">
                <div class="dropdown-trigger">
                    <button class="button" ref="menu">
                        <span class="icon">
                            <i class="mdi mdi-dots-vertical"></i>
                        </span>
                    </button>
                </div>
                <div class="dropdown-menu" role="menu">
                    <div class="dropdown-content">
                        <a class="dropdown-item" v-for="action of allowedActions"
                            @click="triggerAction(action)">
                            {{ action.name }}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import PContentForm from './contentForm'

export default {
    inject: ['actions'],
    props: {
        item: Object,
    },

    data() {
        return {
            /// If true, show edit form
            edit: false,
        }
    },

    computed: {
        allowedActions() {
            if(!this.item.context)
                return []

            let role = this.item.context.role;
            return this.actions.filter((action) => action.isGranted(role, this.item))
        },

        createdString() {
            let date = this.item.createdDate;
            return date ? date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
                        : '';
        },

        modifiedString() {
            let date = this.item.modifiedDate;
            return date ? date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
                        : '';
        },
    },

    methods: {
        triggerAction(action) {
            action.trigger(this.item, this)
        },
    },

    components: { PContentForm },
}
</script>

