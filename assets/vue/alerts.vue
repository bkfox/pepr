<template>
    <div>
        <div v-for="alert in items"
             v-if="alert.text">
            <b-alert dismissible
                :show='alert.countDown'
                :key='alert.id'
                :variant="alert.variant"
                @dismissed="remove(alert)"
                @dismiss-count-down="onCountDown"
            >
                <span :class="alert.icon"></span>
                {{ alert.text }}
                <slot></slot>
            </b-alert>
        </div>
    </div>
</template>

<script>
module.exports = {
    props: {
        'max': { type: Number, default: 6 },
    },

    data() {
        return {
            lastId: 0,
            items: [],
            countDown: 10,
        }
    },

    methods: {
        onCountDown(event) {
            this.countDown = event.countDown;
        },

        add(variant, text, icon='fa-exclamation-circle fas') {
            var alert = {
                id: this.lastId++,
                countDown: this.countDown + text.length,
                variant: variant,
                text: text,
                icon: icon + ' icon mr-2',
            };
            this.items.splice(0, 0, alert);

            if(this.items.length > this.max)
                this.items.splice(this.max);
            return alert;
        },

        remove(alert) {
            var index = this.items.indexOf(alert);
            if(index != -1)
                this.items.splice(index,1);
        },
    },
}
</script>


