define(['./serviceHelper'],function(serviceHelper){
    return {
        getNewProblemDetail:function(cb){
            $.post(serviceHelper.getPath('getNewProblemDetail'),function(result){
                if(!!result.success){
                    cb(result.data);
                    return;
                };
                console.log('Error',result);
            })
        },
        getProblemDetail:function(fileId,cb){
            var parameter = {
                id:'getProblemDetail',
                parameter:{
                    fileId:fileId
                }
            }
            $.post(serviceHelper.getPath(parameter),function(){
                if(!!result.success){
                    cb(result.data);
                    return;
                };
                console.log('Error',result);
            })
        },
        saveReportFile:function(reportFile,cb){
            var url = serviceHelper.getPath('saveReportFile');
            $.ajax({
                type:'post',dataType:'json',url:url,data:reportFile,success:function(result){
                    if(result){
                        if(!!result.success){
                            cb(result.data);
                        }
                    }
                }
            })
        }
    }
});