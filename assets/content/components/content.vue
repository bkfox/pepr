<template>
    <div class="media">
        <div class="media-content">
            <div>
                <strong>{{ item.owner && item.owner.title || "Anonymous" }}</strong>
                <small :title="modifiedString">
                    &mdash; {{ modifiedString }}
                    <span v-if="item && item.created != item.modified" class="icon"
                       :title="'Created on ' + createdString + ', edited on ' + modifiedString">
                        <i class="mdi mdi-pencil-outline"></i>
                    </span>
                </small>
            </div>
            <div v-if="!edit">{{ item.text }}</div>
            <div v-else @done="edit=false">
                <slot name="form" :item="item">
                    <p-content-form :initial="item" @done="edit=false">
                        <template v-if="$slots.formFields" v-slot:fields="{item,model}">
                            <slot name="formFields" :item="item"></slot>
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
                    <button class="button is-white" ref="menu">
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
import { Action } from 'pepr/core'
import PContentForm from './contentForm'

export const actions = [
    new Action('Edit', ['update'], (item, comp) => {
        comp.edit = true
    }),
    new Action('Delete', ['destroy'], (item, comp) => {
        if(confirm('Delete?'))
            item.delete({ delete: 1})
    }),
]


export default {
    props: {
        item: Object,
    },

    data() {
        return {
            /// If true, show edit form
            edit: false,
            // TODO: as prop or optional injection?
            actions,
        }
    },

    computed: {
        allowedActions() {
            if(!this.item.context)
                return []

            let role = this.item.context.role
            return this.actions.filter(action => action.isGranted(role, this.item))
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
        triggerAction(action, ...args) {
            action.trigger(this.item, this, ...args)
        },
    },

    components: { PContentForm },
}
</script>

