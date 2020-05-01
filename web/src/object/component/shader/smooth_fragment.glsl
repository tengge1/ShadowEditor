uniform sampler2D texture;

void main()	{
	vec2 cellSize = 1.0 / resolution.xy;
	vec2 uv = gl_FragCoord.xy * cellSize;
	// Computes the mean of texel and 4 neighbours
	vec4 textureValue = texture2D( texture, uv );
	textureValue += texture2D( texture, uv + vec2( 0.0, cellSize.y ) );
	textureValue += texture2D( texture, uv + vec2( 0.0, - cellSize.y ) );
	textureValue += texture2D( texture, uv + vec2( cellSize.x, 0.0 ) );
	textureValue += texture2D( texture, uv + vec2( - cellSize.x, 0.0 ) );
	textureValue /= 5.0;
	gl_FragColor = textureValue;
}