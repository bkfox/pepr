<template>
    <p-context-form v-bind="$props" v-on="$listeners">
        <template v-slot:main="{data}">
            <p-field-row>
                <p-field name="headline">
                    <component is="input" name="headline" type="text" v-model:value="data.headline"
                        placeholder="Headline" />
                </p-field>
            </p-field-row>
            <slot name="main"></slot>
        </template>
    </p-context-form>
</template>
<script>
import { computed, inject, toRefs } from 'vue'
import * as composables from 'pepr/core/composables'
import { PField, PFieldRow, PContextForm } from 'pepr/core/components'

export default {
    props: PContextForm.props,
    components: { PField, PFieldRow, PContextForm },
}


</script>


