/**
 * Created by shijin on 2015/10/27.
 */
$(function () {
    /**
     * dropzone图片上传js代码
     */
    $("div#uploadImg").dropzone({
        url: "http://up.imgapi.com/",
        addRemoveLinks: true,
        acceptedFiles: 'image/*',
        previewsContainer: '.dropzone-previews',
        previewTemplate: $('#preview-template').html(),
        dictRemoveFile: '',
        dictCancelUpload: '',
        maxFilesize: 5,
        maxFiles: 4,
        thumbnailWidth: 80,
        thumbnailHeight: 120,
        init: function () {
            var dz = this;
            this.on('success', function (file, info) {
                info=JSON.parse(info);
                $(".post_form").append("<input id='" + info.s_url + "' name='img' type='hidden' value='" + JSON.stringify({
                        "sourceImg": info.s_url,
                        "thumbnailImg":info.t_url
                    }) + "'>");
            });
            this.on('removedfile', function (file) {
                $("input[id='" + info.s_url +  "']").remove();
            });
            this.on('maxfilesexceeded', function (file) {
                dz.removeFile(file);
            });
            this.on("sending", function(file, xhr, formData) {
                // Will send the filesize along with the file as POST data.
                formData.append("Token", "88f0c33e127164112ae68aa79ea7745091f54f7a:Y2FCUWJoN2RYYUFVNl9oUG1QM0FqN3I3X0U0PQ==:eyJkZWFkbGluZSI6MTQ1OTg2MDEyOSwiYWN0aW9uIjoiZ2V0IiwidWlkIjoiNTYxODc1IiwiYWlkIjoiMTIxMzQwNiIsImZyb20iOiJmaWxlIn0=");
                formData.append("aid",1213406);
                formData.append("deadline",new Date().getMilliseconds()+60);
                formData.append("form","file");
            });
            $(".close").on('click', function () {
                dz.removeAllFiles();
            });
            $(".img_btn").click(function () {
                $("#imgupload").toggle();
            })
        }
    });

    /**
     * lightbox配置信息

     */
    lightbox.option({
        'resizeDuration': 200,
        'wrapAround': true
    });

    /**
     * bootstrap弹出框：图片上传
     */
    $("[data-toggle='popover']").popover();
    /**
     * 表单验证
     */

    $(".post_btn").click(function () {
        if ($("#post_title").val() != "") {
            if ($("#post_content").val() != "") {
                $("#post_form").submit();
            }
            else {
                $("#post_content").attr("placeholder", "内容不能为空!!!");
            }
        }
        else {
            $("#post_title").attr("placeholder", "标题不能为空!!!");
        }

    });

    $('ul.nav > li').removeClass('active');
    $('#' + '<%=type%>').addClass('active');



});
angular.module('myApp', []);
