$(function() {
    $("form[name='login']").validate({
        rules: {

            // email: {
            //     required: true,
            //     email: true
            // },
            username: {
                required: true
            },
            password: {
                required: true,

            }
        },
        messages: {
            username: "Please enter your username",

            password: {
                required: "Please enter password",

            }

        },
        submitHandler: function(form) {
            form.submit();
        }
    });
});