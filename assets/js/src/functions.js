// Highly inspired by https://github.com/inpsyde/gutenberg-example/blob/ceac1c6fa0f1484b955d2ba5b7414cc5672617b1/assets/js/src/EditorPicks/index.js
// And the final fix by https://github.com/WordPress/gutenberg/issues/12289#issuecomment-441585195
const { CheckboxControl } = wp.components
const { PluginPostStatusInfo } = wp.editPost
const { 
	compose,
	withInstanceId
 } = wp.compose
const { withSelect, withDispatch } = wp.data
const { registerPlugin } = wp.plugins

const Render = ( { meta, updateMeta } ) => {
	const showInDewpPlanet = meta.wpf_show_in_dewp_planet_feed;
	return (
		<PluginPostStatusInfo className='dewp-planet'>
			<div>
				<CheckboxControl
						className={ showInDewpPlanet ? '-is-checked' : '' }
						label={ 'Im DEWP-Planet-Feed anzeigen' }
						checked={ showInDewpPlanet }
						onChange={( value ) => {
							updateMeta( { wpf_show_in_dewp_planet_feed: value || 0 } );
						}}
				/>
				<a href="https://github.com/deworg/dewp-planet-feed/blob/master/ABOUT.md" className="dewp-planet__help-link dashicons-before dashicons-editor-help hide-if-no-js" target="_blank">
					<span className="screen-reader-text">Was ist das?</span>
				</a>
				<span className="dewp-planet__label-notice">
					<span className="dashicons dashicons-warning" aria-hidden="true"></span><strong>Erscheint in allen deutschsprachigen WordPress-Dashboards!</strong>
				</span>
			</div>
		</PluginPostStatusInfo>
	)
}

const DewpPlanetGutenberg = compose(
	[
		withSelect( ( select ) => {
			const {
				getEditedPostAttribute,
			} = select( 'core/editor' );
	
			return {
				meta: getEditedPostAttribute( 'meta' ),
			};
		} ),
		withDispatch( ( dispatch, { meta } ) => {
			const { editPost } = dispatch( 'core/editor' );

			return {
				updateMeta( newMeta ) {
					// Important: Old and new meta need to be merged in a non-mutating way!
					editPost( { meta: { ...meta, ...newMeta } } );
				},
			};
		})
	]
)(Render)

registerPlugin('dewp-planet-gutenberg', {
  render: DewpPlanetGutenberg
})
