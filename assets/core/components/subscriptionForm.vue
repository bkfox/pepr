<template>
    <form ref="form" :method="targetMethod" :action="action" 
            @submit="onSubmit">
        <input type="hidden" name="context_id" :value="currentContext && currentContext.pk" />
    </form>
</template>
<script>
import PForm from 'pepr/core/components/form'

</script>


