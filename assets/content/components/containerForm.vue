<template>
    <p-context-form v-bind="$props" v-on="$listeners">
        <template v-slot:main="{data}">
            <p-field-row label="Headline">
                <p-field name="headline">
                    <component is="input" name="headline" type="text" v-model:value="data.headline"
                        placeholder="Headline" />
                </p-field>
            </p-field-row>
            <slot name="main" :data="data"></slot>
        </template>
    </p-context-form>
</template>
<script>
import { computed, inject, toRefs } from 'vue'
import * as composables from 'pepr/core/composables'
import { PField, PFieldRow, PContextForm } from 'pepr/core/components'

export default {
    emits: PContextForm.emits,
    props: PContextForm.props,
    components: { PField, PFieldRow, PContextForm },
}


</script>


