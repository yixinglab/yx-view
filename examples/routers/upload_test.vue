<template>
    <div>
        <YxUpload 
            :actionInit="actionInit + '?access-token=' + access_token" 
            :actionUpload="actionUpload + '?access-token=' + access_token"
            :actionDownload="actionDownload + '?access-token=' + access_token">
        </YxUpload>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                access_token: "150c616c-6851-468b-b304-2a8c28911d4b",
                actionInit: "http://localhost:8090/v1/files/search",
                actionUpload: "http://localhost:8090/v1/files/upload",
                actionDownload: "http://localhost:8090/v1/files/download"
            };
        }
    }
</script>