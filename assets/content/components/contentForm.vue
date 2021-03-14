<template>
    <form ref="form" :method="targetMethod" :action="action" 
            @submit="onSubmit">
        <slot :item="item" :context="currentContext">
            <input type="hidden" name="context_id" :value="currentContext && currentContext.pk" />
            <slot name="fields" :item="item" :context="currentContext"></slot>
            <div class="field">
                <div class="control">
                    <textarea name="text" class="textarea">{{ item && item.text }}</textarea>
                </div>
            </div>
            <div class="columns">
                <div class="column" v-if="showAccess">
                    <div class="field is-grouped">
                        <p-select-role :name="access" :context="currentContext"
                            :limit="true" title="Visible to">
                        </p-select-role>
                    </div>
                </div>
                <div class="column">
                    <div class="field is-grouped is-grouped-right">
                        <p class="control">
                            <button type="submit" class="button is-link">Publish</button>
                        </p>
                        <p class="control">
                            <button v-if="item" @click="$emit('done')" class="button is-link is-light">
                                Cancel</button>
                            <button v-else type="reset" class="button is-link is-light">
                                Reset</button>
                        </p>
                    </div>
                </div>
            </div>
        </slot>
    </form>
</template>
<script>
import PForm from 'pepr/core/components/form'
import PSelectRole from 'pepr/core/components/selectRole'

export default {
    extends: PForm,
    inject: ['consts'],
    props: {
        /// Show access field
        showAccess: { type: Boolean, default: true },
    },

    components: { PSelectRole },
}
</script>
