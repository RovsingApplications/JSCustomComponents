export default class SVGs {

	public static readonly spinnerSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><path fill="#325d77" d="M40 72C22.4 72 8 57.6 8 40S22.4 8 40 8s32 14.4 32 32c0 1.1-.9 2-2 2s-2-.9-2-2c0-15.4-12.6-28-28-28S12 24.6 12 40s12.6 28 28 28c1.1 0 2 .9 2 2s-.9 2-2 2z"><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 40 40" to="360 40 40" dur="0.6s" repeatCount="indefinite"/></path></svg>`;

	public static readonly timesSVG = `
		<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
			<path d="M 240 200.188 l -80.315 -80.209 80.2 -80.282 -30.697 -30.697 -80.212 80.318 -80.31 -80.203 -30.666 30.666 80.321 80.24 -80.206 80.313 30.666 30.666 80.237 -80.318 80.285 80.203z"/>
		</svg>
	`;

	public static readonly lensSVG = `
		<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve">
			<path d="M970.2,874.4L763,667.2c50.4-70,78-153.7,78-241.8c0-110.9-43.2-215.3-121.8-293.8C640.9,53.2,536.5,10,425.5,10c-111,0-215.3,43.2-293.8,121.7C53.2,210.1,10,314.5,10,425.5s43.2,215.3,121.7,293.8c78.5,78.5,182.8,121.8,293.8,121.8c88,0,171.6-27.6,241.7-78l207.2,207.2c13.3,13.2,30.5,19.8,47.9,19.8c17.3,0,34.7-6.6,47.9-19.8C996.6,943.7,996.6,900.9,970.2,874.4z M227.5,623.5c-52.9-52.9-82-123.3-82-198s29.1-145.1,82-198c52.9-52.9,123.2-82,198-82c74.8,0,145.1,29.1,198,82c52.9,52.9,82.1,123.2,82.1,198c0,74.8-29.1,145.1-82.1,198c-52.9,52.9-123.2,82-198,82S280.3,676.4,227.5,623.5z"/>
		</svg>
	`;

	public static readonly loadingDotsSVG = `
		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
			style="margin:auto;display:block;" width="210px" height="210px" viewBox="0 0 100 100"
			preserveAspectRatio="xMidYMid">
			<g transform="translate(25 50)">
				<circle cx="0" cy="0" r="5" fill="#81a3bd" transform="scale(0.724549 0.724549)">
					<animateTransform attributeName="transform" type="scale" begin="-0.3663003663003663s" calcMode="spline"
						keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0;1;0" keyTimes="0;0.5;1" dur="1.0989010989010988s"
						repeatCount="indefinite"></animateTransform>
				</circle>
			</g>
			<g transform="translate(50 50)">
				<circle cx="0" cy="0" r="5" fill="#81a3bd" transform="scale(0.262312 0.262312)">
					<animateTransform attributeName="transform" type="scale" begin="-0.18315018315018314s" calcMode="spline"
						keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0;1;0" keyTimes="0;0.5;1" dur="1.0989010989010988s"
						repeatCount="indefinite"></animateTransform>
				</circle>
			</g>
			<g transform="translate(75 50)">
				<circle cx="0" cy="0" r="5" fill="#81a3bd" transform="scale(0.0000935793 0.0000935793)">
					<animateTransform attributeName="transform" type="scale" begin="0s" calcMode="spline"
						keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0;1;0" keyTimes="0;0.5;1" dur="1.0989010989010988s"
						repeatCount="indefinite"></animateTransform>
				</circle>
			</g>
		</svg>
	`;


}
