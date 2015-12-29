/**
 * Created by shijin on 2015/10/27.
 */
$(function () {
    /**
     * dropzone图片上传js代码
     */
    $("div#uploadImg").dropzone({
        url: "/upload/img",
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
            console.log(xiix);
            this.on('success', function (file, info) {
                $(".post_form").append("<input id='" + file.name + file.uploadtime + "' name='img' type='hidden' value='" + JSON.stringify(info) + "'>");
            });
            this.on('removedfile', function (file) {
                $("input[id='" + file.name + file.uploadtime + "']").remove();
            });
            this.on('maxfilesexceeded', function (file) {
                dz.removeFile(file);
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


});
angular.module('myApp', []);