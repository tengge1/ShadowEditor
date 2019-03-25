define({
  SIMPLE_SHADER: {
    VS_CONTENT: "attribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\nvarying vec2 vTextureCoord;\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\nvoid main()\n{\ngl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition,1.0);\nvTextureCoord = aTextureCoord;\n}",
    FS_CONTENT: "#ifdef GL_ES\nprecision highp float;\n#endif\nuniform bool uUseTexture;\nuniform float uShininess;\nuniform vec3 uLightDirection;\nuniform vec4 uLightAmbient;\nuniform vec4 uLightDiffuse;\nuniform vec4 uLightSpecular;\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nvoid main()\n{\ngl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));\n}"
  }
});