<template>
    <div class="media">
        <div class="media-content">
            <div>
                <strong>{{ item.owner && item.owner.title || "Anonymous" }}</strong>
                <small>{{ item.modifiedDate }}</small>
            </div>
            <div>{{ item.text }}</div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        messages: { type: Object },
        item: { type: Object },
    }
}
</script>


