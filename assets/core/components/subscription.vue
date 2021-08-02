<template>
    <div>
        <span v-if="item.owner && item.owner.title">{{ item.owner.title }}</span>
        <span v-else>{{ item.owner_id }} (not visible)</span>
        <div class="icon is-large has-text-info">
            <span v-if="item.isSubscribed" class="mdi mdi-account"></span>
            <span v-else class="mdi mdi-account-question"
                title="Awaiting for approval"></span>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        item: Object,
    },
}
</script>

