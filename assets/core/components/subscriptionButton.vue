<template>
    <div class="dropdown is-hoverable is-right">
        <div class="dropdown-trigger">
            <button class="button is-link" v-if="!context || !context.role.is_subscribed"
                @click="subscribe">
                <span class="icon"><i class="mdi mdi-account-multiple"></i></span>
                <span>Subscribe</span>
            </button>
            <button class="button" v-if="context && context.role.is_subscribed"
                @click="editSubscription">
                <span class="icon"><i class="mdi mdi-account-multiple"></i></span>
                <span>{{ consts.roles[context.role.access].name }}</span>
            </button>
        </div>
        <div class="dropdown-menu" role="menu" v-if="context && context.role.is_subscribed">
            <div class="dropdown-content">
                <a href="" class="dropdown-item" @click="unsubscribe">Unsubscribe</a>
            </div>
        </div>
    </div>

</template>
<script>
export default {
    inject: ['consts'],
    props: {
        context: Object,
    },
}
</script>
