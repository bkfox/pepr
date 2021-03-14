<template>
    <div class="control has-icons-left">
        <div class="select">
            <select :name="name" :title="title">
                <template v-for="role of consts.roles">
                    <option v-if="!limit || !context || role.access <= context.role.access"
                        :value="role.access">
                    {{ role.name }}</option>
                </template>
            </select>
        </div>
        <span class="icon is-left">
            <i class="mdi mdi-eye"></i>
        </span>
    </div>
</template>
<script>
export default {
    inject: ['consts'],
    props: {
        context: Object,
        name: String,
        title: { type: String, default: 'Visible to' },
        limit: { type: Boolean, default: false },
    },
}

</script>

