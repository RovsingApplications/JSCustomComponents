import CustomElement from '../../Framework/custom-element.decorator';
import CustomHTMLBaseElement from '../CustomHTMLBaseElement';

@CustomElement({
	selector: 'esignatur-branding-email-preview',
	template: `
			<div class="esignatur-branding-email-preview-container">
				<table border="0" cellpadding="0" cellspacing="0" width="100%"
					style="font-family: Calibri, Arial, Helvetica, sans-serif; font-size: 14px;">
					<tr>
						<td align="center" valign="top">

							<table border="0" cellpadding="20" cellspacing="0" width="100%" id="containing-table"
								style="border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; ">

								<!-- Main container -->
								<tr>
									<td style="padding: 0">
										<table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%"
											style="border-right: 2px solid #315D78; border-left: 2px solid #315D78; border-bottom:2px solid #315D78; border-top:2px solid #315D78; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;">

											<!-- Top bar -->
											<tr>
												<td
													style="background-color: #315D78; height:35px; color:#fff; padding-left:47px; font-size: 14px;">
													<strong><span
															style="font-family:Calibri, arial, helvetica, sans-serif">Signeringsordre
															klar til underskrift</span></strong>
												</td>
											</tr>
											<!-- Top bar end -->

											<!-- Logo -->
											<tr>
												<td>
													<table border="0" cellpadding="50" cellspacing="0" width="100%">
														<tr>
															<td align="right" valign="top"
																style="padding-top: 20px; padding-bottom: 10px;">
																<a href="#">
																	<img border="0"
																		src="https://cdn.esignatur.dk/auto-logos/d/default.png"
																		alt="default website" title="default website" /></a>
															</td>
														</tr>
													</table>
												</td>
											</tr>
											<!-- Logo end -->
											<!-- Info box -->
											<tr>
												<td>
													<table border="0" cellpadding="50" cellspacing="0" width="100%">

														<tr>
															<td align="left" valign="top" style="padding-top: 0; padding-bottom: 30px;">


																<table border="0" cellpadding="0" cellspacing="0" width="100%"
																	style="padding: 0 20px 20px 0; color: #414141; font-size: 14px;">
																	<tr>
																		<td><span
																				style="font-family: Calibri, arial, helvetica, sans-serif">
																				<p>K&aelig;re [Name]</p>
																				<p>Der er et eller flere dokumenter, der venter
																					p&aring; din underskrift.</p>
																				<p><br /></p>
																				<p>[Message]</p>
																			</span></td>
																	</tr>
																</table>

																<table border="0" cellpadding="10" cellspacing="0" width="100%"
																	style="border: 2px solid #315D78; padding: 10px; color: #414141; font-size: 13px;">
																	<!-- Info box item -->
																	<tr>
																		<td align="left" valign="top" width="30%"><span
																				style="font-family:Calibri, arial, helvetica, sans-serif">AFSENDER</span>
																		</td>
																		<td align="left" valign="top" width="70%"
																			style="color: #414141"><b><span
																					style="font-family:Calibri, arial, helvetica, sans-serif">[Sender]</span></b>
																		</td>
																	</tr>
																	<!-- Info box item end -->
																	<!-- Info box item -->
																	<tr>
																		<td align="left" valign="top" width="30%"><span
																				style="font-family:Calibri, arial, helvetica, sans-serif">UNDERSKRIVER(E)</span>
																		</td>
																		<td align="left" valign="top" width="70%"
																			style="color: #414141"><b><span
																					style="font-family:Calibri, arial, helvetica, sans-serif">[Signers]</span></b>
																		</td>
																	</tr>
																	<!-- Info box item end -->
																	<!-- Info box item -->
																	<tr>
																		<td align="left" valign="top" width="30%"><span
																				style="font-family:Calibri, arial, helvetica, sans-serif">DOKUMENT(ER)</span>
																		</td>
																		<td align="left" valign="top" width="70%"
																			style="color: #414141"><b><span
																					style="font-family:Calibri, arial, helvetica, sans-serif">[Documents]</span></b>
																		</td>
																	</tr>
																	<!-- Info box item end -->
																	<!-- Info box item -->
																	<tr>
																		<td align="left" valign="top" width="30%"><span
																				style="font-family:Calibri, arial, helvetica, sans-serif">REFERENCE
																				ID</span></td>
																		<td align="left" valign="top" width="70%"
																			style="color: #414141"><b><span
																					style="font-family:Calibri, arial, helvetica, sans-serif">[ReferenceNumber]</span></b>
																		</td>
																	</tr>
																	<!-- Info box item end -->
																</table>
															</td>
														</tr>
													</table>
												</td>
											</tr><!-- Button -->
											<tr>
												<td>
													<table border="0" cellpadding="50" cellspacing="0" width="100%"
														style="color: #414141; font-size: 14px; min-width: 70px; font-weight: normal; text-decoration: none;">

														<tr>
															<td align="center" valign="top" style="padding-top: 0; text-align: center;">
																<p><strong><span
																			style="font-family:Calibri, arial, helvetica, sans-serif">Klik
																			p&aring; knappen for at l&aelig;se og underskrive dine
																			aftaledokumenter</span></strong></p>

																<table bgcolor="#315D78"
																	style="text-align: center; display: inline-block; font-size: 9pt; min-width: 70px; border: 1px solid #315D78; font-weight: normal; border-radius: 5px; -moz-border-radius: 5px; text-decoration: none; background-color: #315D78;"
																	cellpadding="10">
																	<tr>
																		<td>&nbsp;</td>
																		<td>
																			<b style="color: #fff;">
																				<a target="_blank"
																					style='font-size: 14px; text-decoration: none; color: #fff'
																					href="#"><span
																						style="font-family:Calibri, arial, helvetica, sans-serif">G&aring;
																						til dokument</span></a>
																			</b>
																		</td>
																		<td>&nbsp;</td>
																	</tr>
																</table>

															</td>
														</tr>

													</table>

												</td>
											</tr>
											<!-- Button end-->

											<!-- Bottom information box -->
											<tr>
												<td>

													<table border="0" cellpadding="0" cellspacing="0" width="100%"
														style="background-color: #f2f2f2">
														<tr>
															<td width="10%" height="105px">&nbsp;</td>
															<td width="80%" height="105"
																style="color: #7d7d7d; padding: 10px 0 10px 0;">
																<span style="font-size: 14px">
																	<strong><span
																			style="font-family:Calibri, arial, helvetica, sans-serif">Har
																			du sp&oslash;rgsm&aring;l?</span></strong>
																</span>

																<br />
																<span style="font-size: 13px"><span
																		style="font-family:Calibri, arial, helvetica, sans-serif">Ved
																		sp&oslash;rgsm&aring;l kan du kontakte afsenderen, som du
																		finder l&aelig;ngere oppe i denne mail.</span></span>
															</td>

															<td width="10%" height="105px">&nbsp;</td>
														</tr>
													</table>

												</td>
											</tr>

										</table>
									</td>
								</tr>

								<!-- Bottom information -->
								<tr>
									<td align="center" valign="top">

										<table border="0" cellpadding="0" cellspacing="0" width="100%">
											<tr>
												<td>
													<img border="0" width="100%"
														src="https://cdn.esignatur.dk/CustomerEmails/EmailTemplatesV3/footer_lhs.png"
														alt="Kontakt info: &Oslash;ster All&eacute; 48-50, 2100 K&oslash;benhavn &Oslash;, Tlf: +45 4358 4058, CVR-nr.: 25994833, e-mail: support@esignatur.dk"
														title="Kontakt info: &Oslash;ster All&eacute; 48-50, 2100 K&oslash;benhavn &Oslash;, Tlf: +45 4358 4058, CVR-nr.: 25994833, e-mail: support@esignatur.dk" /></img>
												</td>
												<td><a href="#" alt="esignatur website" title="esignatur website">
														<img border="0" width="100%"
															src="https://cdn.esignatur.dk/CustomerEmails/EmailTemplatesV3/footer_logo.png"
															alt="esignatur website" title="esignatur website" /></a></td>
											</tr>
										</table>

									</td>
								</tr>

							</table>

						</td>
					</tr>
				</table>
		</div>
	`,
	style: `
		.esignatur-branding-email-preview-container {
			width: 600px;
			margin: auto;
			background: #FFFFFF;
		}
	`,
	useShadow: true,
})
export default class BrandingEmailPreview extends CustomHTMLBaseElement {

	constructor() {
		super();
	}

	componentDidMount() {

	}
}
