/*
 * Spartan UI Editor v0.9.0.5
 */
(function() {

	if(!document.body.classList.contains('spartan-ui-loaded')) { // Only load this code once
	
	    // Create Spartan version variable
	    let spartanVersion = '0.9.0.5'

        // Set all of the localStorage items
		if(localStorage.getItem('spartan_ui_version') === null) {
			localStorage.setItem('spartan_ui_version', spartanVersion)
		}
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

        // Load the Spartan stylesheet into the head
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
        
        // Load the appropriate scripts necessary to run Spartan
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
			    buildHTML()
				spartanInit()
			}).catch(function(script) {
				console.log(script)
			})
        
        // Build the Spartan HTML
		function buildHTML() {
		    
            let style = document.createElement('style')
            style.id = 'spartan-ui-ace-css'
            document.head.appendChild(style)
            
            let script = document.createElement('script')
            script.innerHTML = `function spartanUiLoadJs(code = '/* ¯\_(ツ)_/¯ */') {
			let scriptTag = document.createElement('script')
			scriptTag.id = 'spartan-ui-ace-javascript'
			document.head.appendChild(scriptTag)
			document.getElementById('spartan-ui-ace-javascript').innerHTML = code
		}
		spartanUiLoadJs()`
		    document.head.appendChild(script)
		
			let html = document.createElement('div')
			html.id = 'spartan-ui-container'
			html.innerHTML = `<div id="spartan-ui-inner">
					<div id="spartan-ui-heading">
						<div id="spartan-ui-code-select">
							<span id="spartan-ui-select-css" class="spartan-ui-select spartan-ui-selected">CSS</span>
							<span id="spartan-ui-select-javascript" class="spartan-ui-select">JS</span>
							<div id="spartan-ui-javascript-run" class="spartan-ui-button" style="display:none;">Run JS</div>
						</div>
						<div id="spartan-ui-drag-container">
							<img id="spartan-ui-drag-icon" class="spartan-ui-drag-icon-show" src="` + spartanPath + `spartan-icon.png"/>
						</div>
						<div id="spartan-ui-theme-select">
						    <div id="spartan-ui-font-size-toggle" class="spartan-ui-button" title="Toggle Font Size">12px</div>
							<span id="spartan-ui-select-light" class="spartan-ui-select">Light</span>
							<span id="spartan-ui-select-dark" class="spartan-ui-select spartan-ui-selected">Dark</span>
						</div>
					</div>
					<div id="spartan-ui-content-css" class="spartan-ui-content"></div>
					<div id="spartan-ui-content-javascript" class="spartan-ui-content" style="display:none;"></div>
				</div>`
			document.body.appendChild(html)
			
		}

        // Initialize general Spartan functionality
		function spartanInit() {

		    let tabSelector = document.querySelectorAll('.spartan-ui-select')
            tabSelector.forEach(function(tab) {
                tab.addEventListener('click', function(e) {
                    selectToggleClass(e.target)
                    if(e.target.parentNode.getAttribute('id') == 'spartan-ui-code-select') {
                        selectToggleCode(e.target)
                    } else if(e.target.parentNode.getAttribute('id') == 'spartan-ui-theme-select') {
                        selectToggleTheme(e.target)
                    }
                })
            })
		    
		    function selectToggleClass(el) {
                let tabs = el.parentNode.querySelectorAll('span')
                tabs.forEach(tab => {
                    tab.classList.remove('spartan-ui-selected')
                })
				el.classList.add('spartan-ui-selected')
		    }
            
		    function selectToggleCode(el) {
				let codeType = el.getAttribute('id').split('-').pop()
                document.querySelectorAll('.spartan-ui-content').forEach(function(el) {
                    el.style.display = 'none'
                })
                document.getElementById('spartan-ui-content-' + codeType).style.display = 'block'
				if(codeType == 'javascript') {
				    document.getElementById('spartan-ui-javascript-run').style.display = 'block'
					localStorage.setItem('spartan_ui_code_type', 'js')
				} else {
					document.getElementById('spartan-ui-javascript-run').style.display = 'none'
					localStorage.setItem('spartan_ui_code_type', 'css')
				}
		    }
			if(localStorage.getItem('spartan_ui_code_type') == 'js') {
				document.getElementById('spartan-ui-select-javascript').click()
			}
		    
		    function selectToggleTheme(el) {
				let themeType = el.getAttribute('id').split('-').pop()
				if(themeType != localStorage.getItem('spartan_ui_theme_type')) {
				    alert('Refresh browser to finalize editor theme change.')
				}
				if(themeType == 'light') {
				    if(document.body.classList.contains('spartan-ui-theme-dark')) {
				        document.body.classList.remove('spartan-ui-theme-dark')
				    }
				    document.body.classList.add('spartan-ui-theme-light')
					localStorage.setItem('spartan_ui_theme_type', 'light')
				} else {
				    if(document.body.classList.contains('spartan-ui-theme-light')) {
				        document.body.classList.remove('spartan-ui-theme-light')
				    }
				    document.body.classList.add('spartan-ui-theme-dark')
					localStorage.setItem('spartan_ui_theme_type', 'dark')
				}
		    }
		    document.getElementById('spartan-ui-select-' + localStorage.getItem('spartan_ui_theme_type')).click()
			
			document.getElementById('spartan-ui-font-size-toggle').textContent = localStorage.getItem('spartan_ui_font_size') + 'px'
			document.getElementById('spartan-ui-font-size-toggle').addEventListener('click', (e) => {
        		if(localStorage.getItem('spartan_ui_font_size') == '12') {
        		    e.target.textContent = '14px'
        			localStorage.setItem('spartan_ui_font_size', '14')
        		} else {
        		    e.target.textContent = '12px'
        		    localStorage.setItem('spartan_ui_font_size', '12')
        		}
        		alert('Refresh browser to finalize editor font size change.')
			})
			
			spartanDraggable()
			
			aceInit()
			
			document.getElementById('spartan-ui-javascript-run').addEventListener('click', () => {
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
		    
		    let spartanContent = document.querySelectorAll('.spartan-ui-content')
            spartanContent.forEach(function(content) {
				let contentID = content.getAttribute('id'),
					codeType = contentID.split('-').pop(),
					editor = ace.edit(contentID)
        		if(codeType == 'css') {
        		    editor.getSession().setValue(localStorage.getItem('spartan_ui_css_code'))
        		    document.getElementById('spartan-ui-ace-css').textContent = editor.getSession().getValue()
        		} else if(codeType == 'javascript') {
        		    editor.getSession().setValue(localStorage.getItem('spartan_ui_js_code'))
        		    document.getElementById('spartan-ui-ace-javascript').textContent = editor.getSession().getValue()
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
                editor.getSession().addEventListener('change', function(e) {
					if(codeType == 'css') {
						document.getElementById('spartan-ui-ace-css').textContent = editor.getSession().getValue()
						localStorage.setItem('spartan_ui_css_code', editor.getSession().getValue())
					} else if(codeType == 'javascript') {
						document.getElementById('spartan-ui-ace-javascript').textContent = editor.getSession().getValue()
						localStorage.setItem('spartan_ui_js_code', editor.getSession().getValue())
					}
                })
                new ResizeObserver(() => {
                    editor.resize()
                }).observe(content)
            })
			
		}
        
        // Execute any JS code inside the JS editor
		function runJS() {
		    
			let code = document.getElementById('spartan-ui-ace-javascript').textContent
			document.getElementById('spartan-ui-ace-javascript').remove()
			spartanUiLoadJs(code)
			// Ensure that the Spartan icon does not fade in and out more than necessary
			if(!document.body.classList.contains('spartan-ui-js-code-running')) {
			    document.body.classList.add('spartan-ui-js-code-running')
			    document.getElementById('spartan-ui-drag-icon').classList.replace('spartan-ui-drag-icon-show', 'spartan-ui-drag-icon-hide')
			    setTimeout(function() {
			        document.getElementById('spartan-ui-drag-icon').classList.replace('spartan-ui-drag-icon-hide', 'spartan-ui-drag-icon-show')
			    }, (1000))
			    setTimeout(function() {
			        document.body.classList.remove('spartan-ui-js-code-running')
			    }, (2000))
			}
			
		}

	} else { // Once loaded then simply show/hide Spartan

		if(document.body.classList.contains('spartan-ui-active')) {
			document.body.classList.remove('spartan-ui-active')
			document.getElementById('spartan-ui-container').style.display = 'none'
		} else {
			document.body.classList.add('spartan-ui-active')
			document.getElementById('spartan-ui-container').style.display = 'block'
		}

	}

})()