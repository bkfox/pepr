<template>
    <div :class="{field: true, 'is-horizontal': horizontal}">
        <template v-if="horizontal">
            <div v-if="label" class="field-label">
                <label class="label">{{ label }}</label>
            </div>
            <div v-else class="field-label"></div>
            <div class="field-body">
                <slot></slot>
            </div>
        </template>
        <template v-else>
            <label class="label" v-if="label">{{ label }}</label>
            <slot></slot>
            <template v-for="cls in messages">
                <span :class="['help', cls]">
                    {{ messages[cls] }}
                </span>
            </template>
        </template>
    </div>
</template>
<script>
export default {
    props: {
        label: String,
        messages: Object,
        horizontal: { type: Boolean, default: false },
    }
}
</script>
