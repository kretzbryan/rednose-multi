let map;

$(document).ready(() => {
	const $loginError = $.trim($('#login-error').text());

	if ($loginError !== '') {
		$('#loginModal').modal('show');
	}

	const $registerError = $.trim($('#register-error').text());

	if ($registerError !== '') {
		$('#registerModal').modal('show');
	}
});

console.log('');
