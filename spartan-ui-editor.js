/*
 * Spartan UI Editor v0.9.0.1
 */
(function() {

	if(!document.body.classList.contains('spartan-ui-loaded')) { // Only load this code once

        // Set all of the localStorage items
		if(localStorage.getItem('spartan_ui_code_type') === null) {
			localStorage.setItem('spartan_ui_code_type', 'css')
		}
		if(localStorage.getItem('spartan_ui_theme_type') === null) {
			localStorage.setItem('spartan_ui_theme_type', 'dark')
		}
		if(localStorage.getItem('spartan_ui_font_size') === null) {
			localStorage.setItem('spartan_ui_font_size', '12')
		}
		if(localStorage.getItem('spartan_ui_css_code') === null) {
			localStorage.setItem('spartan_ui_css_code', '')
		}
		if(localStorage.getItem('spartan_ui_js_code') === null) {
			localStorage.setItem('spartan_ui_js_code', '')
		}

		document.body.classList.add('spartan-ui-loaded')
		document.body.classList.add('spartan-ui-active')
		const spartanPath = document.currentScript.src.replace(/[^\/]+$/,'')

        // Load the Sparton stylesheet into the head
		function loadStyles() {
			let styles = [
				spartanPath + 'spartan-ui-editor.css'
			]

			styles.forEach(function(style, index) {
				let styleTag = document.createElement('link')
				styleTag.rel = 'stylesheet'
				styleTag.type = 'text/css'
				styleTag.href = style
				document.head.appendChild(styleTag)
			})
		}
		loadStyles()
        
        // Load the appropriate scripts necessary to run Sparton
		function loadScript(url) {
			return new Promise(function(resolve, reject) {
				let script = document.createElement('script')
				script.src = url
				script.async = false
				script.onload = function() {
					resolve(url)
				}
				script.onerror = function() {
					reject(url)
				}
				document.head.appendChild(script)
			})
		}

		let scripts = [
			'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.4/jquery.min.js',
			'https://cdn.jsdelivr.net/gh/ajaxorg/ace-builds@1.16.0/src-min-noconflict/ace.js',
			'https://cdn.jsdelivr.net/gh/ajaxorg/ace-builds@1.16.0/src-min-noconflict/ext-language_tools.min.js',
			'https://cdn.jsdelivr.net/gh/ajaxorg/ace-builds@1.16.0/src-min-noconflict/ext-searchbox.min.js',
			'https://cdn.jsdelivr.net/gh/ajaxorg/ace-builds@1.16.0/src-min-noconflict/mode-css.min.js',
			'https://cdn.jsdelivr.net/gh/ajaxorg/ace-builds@1.16.0/src-min-noconflict/worker-css.min.js',
			'https://cdn.jsdelivr.net/gh/ajaxorg/ace-builds@1.16.0/src-min-noconflict/mode-javascript.min.js',
			'https://cdn.jsdelivr.net/gh/ajaxorg/ace-builds@1.16.0/src-min-noconflict/worker-javascript.min.js',
			'https://cdn.jsdelivr.net/gh/ajaxorg/ace-builds@1.16.0/src-min-noconflict/theme-tomorrow_night_eighties.min.js',
			'https://cdn.jsdelivr.net/gh/ajaxorg/ace-builds@1.16.0/src-min-noconflict/theme-textmate.min.js',
			'https://cdn.jsdelivr.net/gh/ajaxorg/ace-builds@1.16.0/src-min-noconflict/snippets/css.min.js',
			'https://cdn.jsdelivr.net/gh/ajaxorg/ace-builds@1.16.0/src-min-noconflict/snippets/javascript.min.js'
		]

		let promises = []
		scripts.forEach(function(url) {
			promises.push(loadScript(url))
		})

		Promise.all(promises)
			.then(function() {
				$(document).ready(function() {
					buildHTML()
					spartanInit()
				})
			}).catch(function(script) {
				console.log(script)
			})
        
        // Build the Sparton HTML
		function buildHTML() {
			const styleTag = '<style id="spartan-ui-ace-css"></style>'
			const scriptTag = `<script>
		function spartanUiLoadJs(code = '/* ¯\_(ツ)_/¯ */') {
			let scriptTag = document.createElement('script')
			scriptTag.id = 'spartan-ui-ace-javascript'
			document.head.appendChild(scriptTag)
			document.getElementById('spartan-ui-ace-javascript').innerHTML = code
		}
		spartanUiLoadJs()
	</script>`
			const spartanHtml = `<div id="spartan-ui-container">
				<div id="spartan-ui-inner">
					<div id="spartan-ui-heading">
						<div id="spartan-ui-code-select">
							<span id="spartan-ui-select-css" class="spartan-ui-select spartan-ui-selected">CSS</span>
							<span id="spartan-ui-select-javascript" class="spartan-ui-select">JS</span>
							<div id="spartan-ui-javascript-run" class="spartan-ui-button" style="display:none;">Run JS</div>
						</div>
						<div id="spartan-ui-drag-container">
							<img id="spartan-ui-drag-icon" src="` + spartanPath + `spartan-icon.png"/>
						</div>
						<div id="spartan-ui-theme-select">
						    <div id="spartan-ui-font-size-toggle" class="spartan-ui-button" title="Toggle Font Size">12px</div>
							<span id="spartan-ui-select-light" class="spartan-ui-select">Light</span>
							<span id="spartan-ui-select-dark" class="spartan-ui-select spartan-ui-selected">Dark</span>
						</div>
					</div>
					<div id="spartan-ui-content-css" class="spartan-ui-content"></div>
					<div id="spartan-ui-content-javascript" class="spartan-ui-content" style="display:none"></div>
				</div>
			</div>`
			$('head').append(styleTag).append(scriptTag)
			$('body').prepend(spartanHtml)
		}

        // Initialize general Sparton functionality
		function spartanInit() {
			$('#spartan-ui-code-select span, #spartan-ui-theme-select span').click(function() {
				$(this).parent().find('span').removeClass('spartan-ui-selected')
				$(this).addClass('spartan-ui-selected')
			})
			$('#spartan-ui-code-select span').click(function() {
				let codeType = $(this).attr('id').split('-').pop()
				$('.spartan-ui-content').hide()
				$('#spartan-ui-content-' + codeType).show()
				if(codeType == 'javascript') {
					$('#spartan-ui-javascript-run').show()
					localStorage.setItem('spartan_ui_code_type', 'js')
				} else {
					$('#spartan-ui-javascript-run').hide()
					localStorage.setItem('spartan_ui_code_type', 'css')
				}
			})
			if(localStorage.getItem('spartan_ui_code_type') == 'js') {
				$('#spartan-ui-select-javascript').click()
			}
			$('#spartan-ui-font-size-toggle').text(localStorage.getItem('spartan_ui_font_size') + 'px')
			$('#spartan-ui-font-size-toggle').click(function() {
        		if(localStorage.getItem('spartan_ui_font_size') == '12') {
        		    $(this).text('14px')
        			localStorage.setItem('spartan_ui_font_size', '14')
        		} else {
        		    $(this).text('12px')
        		    localStorage.setItem('spartan_ui_font_size', '12')
        		}
        		alert('Refresh browser to finalize editor font size change.')
			})
			
			$('#spartan-ui-theme-select span').click(function() {
				let themeType = $(this).attr('id').split('-').pop()
				if(themeType != localStorage.getItem('spartan_ui_theme_type')) {
				    alert('Refresh browser to finalize editor theme change.')
				}
				if(themeType == 'light') {
				    $('body').removeClass('spartan-ui-theme-dark').addClass('spartan-ui-theme-light')
					localStorage.setItem('spartan_ui_theme_type', 'light')
				} else {
				    $('body').removeClass('spartan-ui-theme-light').addClass('spartan-ui-theme-dark')
					localStorage.setItem('spartan_ui_theme_type', 'dark')
				}
			})
			$('#spartan-ui-select-' + localStorage.getItem('spartan_ui_theme_type')).click()
			spartanDraggable()
			aceInit()
			$('#spartan-ui-javascript-run').click(function() {
				runJS()
			})
		}

        // Simple pure javascript dragable functionality
		function spartanDraggable() {
			let spartanContainer = document.getElementById('spartan-ui-container'),
				container = document.body,
				originalY, elementY, originalX, elementX

			document.getElementById('spartan-ui-drag-container').addEventListener('mousedown', function(e) {
				e.preventDefault()
				originalY = e.clientY
				originalX = e.clientX
				elementY = spartanContainer.offsetTop
				elementX = spartanContainer.offsetLeft
				window.addEventListener('mousemove', dragIt, false)
				window.addEventListener('mouseup', function() {
					window.removeEventListener('mousemove', dragIt, false)
				}, false)
			}, false)

			function dragIt(e) {
				let deltaY = e.clientY - originalY
				let deltaX = e.clientX - originalX
				originalY = e.clientY
				originalX = e.clientX
				elementY += deltaY
				elementX += deltaX
				spartanContainer.style.top = elementY + 'px'
				spartanContainer.style.left = Math.min(Math.max(container.getBoundingClientRect().left, elementX), container.getBoundingClientRect().right- spartanContainer.offsetWidth) + 'px'
				spartanContainer.style.top = Math.min(Math.max(container.getBoundingClientRect().top, elementY), container.getBoundingClientRect().bottom - spartanContainer.offsetHeight) + 'px'
			}
		}

        // Initialize the Ace Editor
		function aceInit() {
			$('.spartan-ui-content').each(function() {
				let contentID = $(this).attr('id'),
					codeType = contentID.split('-').pop(),
					editor = ace.edit(contentID)
        		if(codeType == 'css') {
        		    editor.getSession().setValue(localStorage.getItem('spartan_ui_css_code'))
        		    $('#spartan-ui-ace-css').text(editor.getSession().getValue())
        		} else if(codeType == 'javascript') {
        		    editor.getSession().setValue(localStorage.getItem('spartan_ui_js_code'))
        		    $('#spartan-ui-ace-javascript').text(editor.getSession().getValue())
        		}
				if(localStorage.getItem('spartan_ui_theme_type') == 'light') {
					editor.setTheme('ace/theme/textmate')
				} else {
					editor.setTheme('ace/theme/tomorrow_night_eighties')
				}
				editor.getSession().setMode('ace/mode/' + codeType)
				editor.setShowPrintMargin(false)
                editor.setOptions({
                    useWorker: true,
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    useSoftTabs: true,
                    fontSize: localStorage.getItem('spartan_ui_font_size') + 'px'
                })
				editor.getSession().on('change', function() {
					if(codeType == 'css') {
						$('#spartan-ui-ace-css').text(editor.getSession().getValue())
						localStorage.setItem('spartan_ui_css_code', editor.getSession().getValue())
					} else if(codeType == 'javascript') {
						$('#spartan-ui-ace-javascript').text(editor.getSession().getValue())
						localStorage.setItem('spartan_ui_js_code', editor.getSession().getValue())
					}
				})
                $('.spartan-ui-content').each(function() {
                    new ResizeObserver(() => {
                        editor.resize()
                    }).observe($(this)[0])
                })
			})
		}
        
        // Execute any JS code inside the JS editor
		function runJS() {
			let code = $('#spartan-ui-ace-javascript').text()
			$('#spartan-ui-ace-javascript').remove()
			spartanUiLoadJs(code)
			$('#spartan-ui-drag-icon').fadeOut(1000).fadeIn(1000)
		}

	} else { // Once loaded then simply show/hide Sparton

		if(document.body.classList.contains('spartan-ui-active')) {
			document.body.classList.remove('spartan-ui-active')
			document.getElementById('spartan-ui-container').style.display = 'none'
		} else {
			document.body.classList.add('spartan-ui-active')
			document.getElementById('spartan-ui-container').style.display = 'block'
		}

	}

})()