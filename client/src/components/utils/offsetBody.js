export default () => {
	const body = document.getElementsByClassName("bc")[0];
	const navbar = document.getElementsByClassName("navbar")[0];
	body.style.marginTop = navbar.clientHeight + 30 + "px";
};
