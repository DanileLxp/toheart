jQuery(document).ready(function($) {
    var $loadMoreButton = $('#load-more-button');

    $loadMoreButton.on('click', function() {
        var remainingCount = $loadMoreButton.data('remaining'); // 
        var maxDisplayCount = 10; // 每次数量

        $.ajax({
            url: zxplGoodComments.ajaxUrl, // wp_localize_script 传递 AJAX URL
            type: 'POST',
            dataType: 'json',
            data: {
                action: zxplGoodComments.ajaxAction, // wp_localize_script 传递 AJAX 动作
                remainingCount: remainingCount,
                maxDisplayCount: maxDisplayCount
            },
            beforeSend: function() {
                // 在 AJAX 请求发送之前隐藏按钮
                $loadMoreButton.fadeOut('fast', function() {
                    $(this).text('加载中...').fadeIn('fast');
                });
            },
            success: function(response) {
                if (response.success) {
                    var comments = response.data.comments;
                    var newRemainingCount = response.data.remainingCount;

                    $('#comment-list').append(comments);

                    if (newRemainingCount <= 0) {
                        // 当无评论可加载， "加载完毕"
                        $loadMoreButton.fadeOut('fast', function() {
                            $(this).text('加载完毕').fadeIn('fast');
                        }).prop('disabled', true); // 禁用按钮
                    } else {
                        // 更新剩余评论数量，并显示按钮
                        $loadMoreButton.data('remaining', newRemainingCount).addClass('visible');
                    }
                }
            },
            complete: function() {
                // 在 AJAX 请求完成后，将按钮文本更改为 "加载完毕"
                $loadMoreButton.text('加载完毕');
            }
        });
    });
});
