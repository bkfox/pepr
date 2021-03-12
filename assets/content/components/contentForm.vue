<template>
    <form ref="form" :method="targetMethod" :action="action" 
            @submit="onSubmit">
        <slot :item="item" :context="context" :model="model">
            <input type="hidden" name="context_id" :value="context && context.pk" />
            <div class="field">
                <div class="control">
                    <textarea name="text" class="textarea">{{ item && item.text }}</textarea>
                </div>
            </div>
            <div class="columns">
                <div class="column">
                    <div class="field is-grouped">
                        <div class="control has-icons-left">
                            <div class="select">
                                <select name="access" title="Visible to">
                                    <option v-for="role of consts.roles" 
                                            :value="role.access">
                                            {{ role.name }}</option>
                                </select>
                            </div>
                            <span class="icon is-left">
                                <i class="mdi mdi-eye"></i>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="column">
                    <div class="field is-grouped is-grouped-right">
                        <p class="control">
                            <button type="submit" class="button is-link">Publish</button>
                        </p>
                        <p class="control">
                            <button type="reset" class="button is-link is-light">Reset</button>
                        </p>
                    </div>
                </div>
            </div>
        </slot>
    </form>
</template>
<script>
import { Form } from 'pepr/core/components'

export default {
    extends: Form,
    props: {
        context: Object,
        item: Object,
    },

    computed: {
        consts() {
            return this.$root.consts
        },
    },
}
</script>
