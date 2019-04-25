<template>
    <table>
        <slot name="header"></slot>
        <tbody>
            <tr v-for="(item, index) in items"
                ref="items" :key="item.key">
                <slot name="item" :item="item" :index="index" :list="this">
                </slot>
            </tr>
            <slot></slot>
        </tbody>
        <slot name="footer"></slot>
    </table>
</template>


<script>
import List from './list';

/**
 * Component rendering items of an array. Data can be retrieved and
 * synchronized from the server using properties ('path', 'pubsubPath',
 * ...).
 */
export default {
    extends: List,
};
</script>


