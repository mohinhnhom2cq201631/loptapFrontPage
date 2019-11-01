$(function() {

    $("form[name='registration']").validate({
        rules: {
            fullname: "required",
            username: {
                required: true,
                minlength: 6
            },
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                minlength: 5
            },
            repassword: {
                required: true,
            }
        },

        messages: {
            fullname: "Please enter your fullname",
            username: "Please enter your username",
            password: {
                required: "Please provide a password",
                minlength: "Your password must be at least 5 characters long"
            },
            repassword: {
                required: "Please provide a password",
            },
            email: "Please enter a valid email address"
        },

        submitHandler: function(form) {
            form.submit();
        }
    });
});