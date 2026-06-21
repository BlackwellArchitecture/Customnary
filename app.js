/* Customnary — Live Preview & Image Export Logic */

document.addEventListener('DOMContentLoaded', () => {
    // UI Elements - Inputs
    const inputWord = document.getElementById('input-word');
    const inputIpa = document.getElementById('input-ipa');
    const inputPos = document.getElementById('input-pos');
    const customPosContainer = document.getElementById('custom-pos-container');
    const inputCustomPos = document.getElementById('input-custom-pos');
    const inputDefinition = document.getElementById('input-definition');
    const inputExamples = document.getElementById('input-examples');
    const inputSynonyms = document.getElementById('input-synonyms');
    const inputAntonyms = document.getElementById('input-antonyms');
    const inputEtymology = document.getElementById('input-etymology');
    
    // UI Elements - Style Controls
    const themeButtons = document.querySelectorAll('.theme-btn');
    const selectAspectRatio = document.getElementById('select-aspect-ratio');
    const selectBorder = document.getElementById('select-border');
    const selectFontFamily = document.getElementById('select-font-family');
    const inputCustomHeader = document.getElementById('input-custom-header');
    const rangeFontSize = document.getElementById('range-font-size');
    const valFontSize = document.getElementById('val-font-size');
    const rangePadding = document.getElementById('range-padding');
    const valPadding = document.getElementById('val-padding');
    const checkTexture = document.getElementById('check-texture');
    const checkHeader = document.getElementById('check-header');

    // UI Elements - Action Buttons
    const btnDownloadPng = document.getElementById('btn-download-png');
    const btnDownloadJpg = document.getElementById('btn-download-jpg');
    const btnCopyClipboard = document.getElementById('btn-copy-clipboard');
    const btnClear = document.getElementById('btn-clear');
    const btnIpaTranslate = document.getElementById('btn-ipa-translate');

    // Preview Elements
    const captureCard = document.getElementById('capture-card');
    const cardInner = document.getElementById('card-inner');
    const paperTexture = document.querySelector('.paper-texture-overlay');
    
    const lblWord = document.getElementById('lbl-word');
    const lblIpa = document.getElementById('lbl-ipa');
    const lblPos = document.getElementById('lbl-pos');
    const lblDefinition = document.getElementById('lbl-definition');
    const lblExamplesContainer = document.getElementById('lbl-examples-container');
    const lblThesaurusContainer = document.getElementById('lbl-thesaurus-container');
    const lblSynonymsRow = document.getElementById('lbl-synonyms-row');
    const lblSynonyms = document.getElementById('lbl-synonyms');
    const lblAntonymsRow = document.getElementById('lbl-antonyms-row');
    const lblAntonyms = document.getElementById('lbl-antonyms');
    const lblEtymologyContainer = document.getElementById('lbl-etymology-container');
    const lblEtymology = document.getElementById('lbl-etymology');
    
    const cardBookHeader = document.getElementById('card-book-header');
    const lblGuideLeft = document.getElementById('lbl-guide-left');
    const lblBookTitle = document.getElementById('lbl-book-title');
    const lblPageNum = document.getElementById('lbl-page-num');

    // Randomize page number on load
    lblPageNum.textContent = Math.floor(Math.random() * 850) + 120;

    // Generate and inject noise texture
    injectNoiseBackground();

    /* ==========================================================================
       Content Binding & Render Handlers
       ========================================================================== */

    function updatePreview() {
        // 1. Word & Guide word
        const wordText = inputWord.value.trim() || 'Word';
        lblWord.textContent = wordText;
        lblGuideLeft.textContent = wordText.toUpperCase();

        // 2. IPA
        const ipaText = inputIpa.value.trim();
        if (ipaText) {
            lblIpa.textContent = ipaText;
            lblIpa.style.display = 'inline-block';
        } else {
            lblIpa.style.display = 'none';
        }

        // 3. Part of speech
        let posValue = inputPos.value;
        if (posValue === 'custom') {
            customPosContainer.classList.remove('hidden');
            posValue = inputCustomPos.value.trim() || 'word';
        } else {
            customPosContainer.classList.add('hidden');
        }
        lblPos.textContent = posValue;

        // 4. Definition
        lblDefinition.textContent = inputDefinition.value.trim() || 'A definition will appear here.';

        // 5. Example Sentences
        const examplesText = inputExamples.value.trim();
        lblExamplesContainer.innerHTML = '';
        if (examplesText) {
            lblExamplesContainer.style.display = 'flex';
            const lines = examplesText.split('\n').filter(line => line.trim() !== '');
            lines.forEach(line => {
                const item = document.createElement('div');
                item.className = 'example-item';
                
                const bullet = document.createElement('span');
                bullet.className = 'bullet';
                bullet.innerHTML = '•';
                
                const textSpan = document.createElement('span');
                textSpan.className = 'example-text';
                textSpan.textContent = line.trim();
                
                item.appendChild(bullet);
                item.appendChild(textSpan);
                lblExamplesContainer.appendChild(item);
            });
        } else {
            lblExamplesContainer.style.display = 'none';
        }

        // 6. Synonyms & Antonyms (Thesaurus)
        const synsText = inputSynonyms.value.trim();
        const antsText = inputAntonyms.value.trim();
        
        let hasSyns = false;
        let hasAnts = false;

        if (synsText) {
            lblSynonyms.textContent = synsText;
            lblSynonymsRow.style.display = 'block';
            hasSyns = true;
        } else {
            lblSynonymsRow.style.display = 'none';
        }

        if (antsText) {
            lblAntonyms.textContent = antsText;
            lblAntonymsRow.style.display = 'block';
            hasAnts = true;
        } else {
            lblAntonymsRow.style.display = 'none';
        }

        if (hasSyns || hasAnts) {
            lblThesaurusContainer.style.display = 'flex';
        } else {
            lblThesaurusContainer.style.display = 'none';
        }

        // 7. Etymology
        const etymText = inputEtymology.value.trim();
        if (etymText) {
            lblEtymologyContainer.style.display = 'block';
            lblEtymology.textContent = etymText.startsWith('[') && etymText.endsWith(']') 
                ? etymText 
                : `[${etymText}]`;
        } else {
            lblEtymologyContainer.style.display = 'none';
        }

        // 8. Book Title
        lblBookTitle.textContent = inputCustomHeader.value.trim() || 'DICTIONARY';
    }

    // Attach listeners to input elements for real-time updates
    [inputWord, inputIpa, inputPos, inputCustomPos, inputDefinition, inputExamples, 
     inputSynonyms, inputAntonyms, inputEtymology, inputCustomHeader].forEach(el => {
        el.addEventListener('input', updatePreview);
    });

    inputPos.addEventListener('change', updatePreview);

    /* ==========================================================================
       Style Modifiers Handlers
       ========================================================================== */

    // Theme Selector
    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            themeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const theme = btn.dataset.theme;
            
            // Remove all themes classes from capture card
            captureCard.classList.forEach(className => {
                if (className.startsWith('theme-')) {
                    captureCard.classList.remove(className);
                }
            });
            
            // Add selected theme class
            captureCard.classList.add(`theme-${theme}`);
        });
    });

    // Aspect Ratio
    selectAspectRatio.addEventListener('change', () => {
        // Clear aspect classes
        captureCard.classList.remove('aspect-square', 'aspect-portrait', 'aspect-story', 'aspect-auto');
        captureCard.classList.add(`aspect-${selectAspectRatio.value}`);
    });

    // Border Styles
    selectBorder.addEventListener('change', () => {
        cardInner.classList.forEach(className => {
            if (className.startsWith('border-')) {
                cardInner.classList.remove(className);
            }
        });
        cardInner.classList.add(`border-${selectBorder.value}`);
    });

    // Typography
    selectFontFamily.addEventListener('change', () => {
        cardInner.classList.forEach(className => {
            if (className.startsWith('font-')) {
                cardInner.classList.remove(className);
            }
        });
        cardInner.classList.add(selectFontFamily.value);
    });

    // Base Font Size Sliders
    rangeFontSize.addEventListener('input', () => {
        const sizeVal = rangeFontSize.value;
        valFontSize.textContent = `${sizeVal}px`;
        captureCard.style.setProperty('--card-font-size', `${sizeVal}px`);
    });

    // Card Padding Slider
    rangePadding.addEventListener('input', () => {
        const paddingVal = rangePadding.value;
        valPadding.textContent = `${paddingVal}px`;
        captureCard.style.setProperty('--card-padding', `${paddingVal}px`);
    });

    // Texture Toggle
    checkTexture.addEventListener('change', () => {
        if (checkTexture.checked) {
            paperTexture.style.display = 'block';
        } else {
            paperTexture.style.display = 'none';
        }
    });

    // Header Toggle
    checkHeader.addEventListener('change', () => {
        if (checkHeader.checked) {
            cardBookHeader.style.display = 'flex';
        } else {
            cardBookHeader.style.display = 'none';
        }
    });

    /* ==========================================================================
       Canvas-Based Noise Background Generator
       ========================================================================== */

    function injectNoiseBackground() {
        const canvas = document.createElement('canvas');
        canvas.width = 150;
        canvas.height = 150;
        const ctx = canvas.getContext('2d');
        const imgData = ctx.createImageData(canvas.width, canvas.height);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
            const val = Math.floor(Math.random() * 255);
            // Grayscale noise color values
            data[i] = val;     // R
            data[i + 1] = val; // G
            data[i + 2] = val; // B
            // Extremely light opacity for blending with background card color
            data[i + 3] = Math.floor(Math.random() * 20) + 5; 
        }

        ctx.putImageData(imgData, 0, 0);
        const textureUrl = canvas.toDataURL('image/png');
        paperTexture.style.backgroundImage = `url(${textureUrl})`;
    }

    /* ==========================================================================
       Export Actions (PNG, JPEG, Copy Clipboard)
       ========================================================================== */

    function getCardBgColor() {
        // Read card background dynamically from stylesheet variable
        return getComputedStyle(captureCard).getPropertyValue('--card-bg').trim();
    }

    function exportToImage(format) {
        // Show indicator on buttons during render
        const origBtnText = format === 'png' ? btnDownloadPng.innerHTML : btnDownloadJpg.innerHTML;
        const activeBtn = format === 'png' ? btnDownloadPng : btnDownloadJpg;
        activeBtn.innerHTML = '<span class="btn-icon"><i class="fa-solid fa-spinner fa-spin"></i></span> Processing...';
        activeBtn.disabled = true;

        // Render card
        html2canvas(captureCard, {
            scale: 3, // High DPI resolution (300% size)
            useCORS: true,
            allowTaint: true,
            backgroundColor: getCardBgColor()
        }).then(canvas => {
            let mimeType = 'image/png';
            let extension = 'png';
            let quality = 1.0;

            if (format === 'jpg' || format === 'jpeg') {
                mimeType = 'image/jpeg';
                extension = 'jpg';
                quality = 0.95; // Premium high quality JPEG compression
            }

            const word = inputWord.value.trim() || 'definition';
            const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, '_');
            const filename = `${cleanWord}_definition.${extension}`;

            // Create download anchor
            const link = document.createElement('a');
            link.download = filename;
            link.href = canvas.toDataURL(mimeType, quality);
            link.click();

            // Restore buttons
            activeBtn.innerHTML = origBtnText;
            activeBtn.disabled = false;
        }).catch(err => {
            console.error('Error exporting image:', err);
            alert('Failed to generate image. Please try again.');
            activeBtn.innerHTML = origBtnText;
            activeBtn.disabled = false;
        });
    }

    function copyCardToClipboard() {
        const origHtml = btnCopyClipboard.innerHTML;
        btnCopyClipboard.innerHTML = '<span class="btn-icon"><i class="fa-solid fa-spinner fa-spin"></i></span> Copying...';
        btnCopyClipboard.disabled = true;

        html2canvas(captureCard, {
            scale: 3,
            useCORS: true,
            allowTaint: true,
            backgroundColor: getCardBgColor()
        }).then(canvas => {
            canvas.toBlob(blob => {
                if (!blob) {
                    throw new Error('Canvas conversion to blob failed.');
                }
                
                navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob })
                ]).then(() => {
                    btnCopyClipboard.innerHTML = '<span class="btn-icon"><i class="fa-solid fa-check"></i></span> Copied!';
                    btnCopyClipboard.style.backgroundColor = '#10b981';
                    btnCopyClipboard.style.borderColor = '#10b981';
                    
                    setTimeout(() => {
                        btnCopyClipboard.innerHTML = origHtml;
                        btnCopyClipboard.style.backgroundColor = '';
                        btnCopyClipboard.style.borderColor = '';
                        btnCopyClipboard.disabled = false;
                    }, 2000);
                }).catch(err => {
                    console.error('Clipboard write failed:', err);
                    alert('Clipboard writing failed. Direct copying might be restricted by your browser policies. Try downloading instead.');
                    btnCopyClipboard.innerHTML = origHtml;
                    btnCopyClipboard.disabled = false;
                });
            }, 'image/png');
        }).catch(err => {
            console.error('Error copying image:', err);
            alert('Failed to process image. Try downloading it.');
            btnCopyClipboard.innerHTML = origHtml;
            btnCopyClipboard.disabled = false;
        });
    }

    // Attach click events to actions
    btnDownloadPng.addEventListener('click', () => exportToImage('png'));
    btnDownloadJpg.addEventListener('click', () => exportToImage('jpg'));
    btnCopyClipboard.addEventListener('click', copyCardToClipboard);

    // Clear all inputs
    btnClear.addEventListener('click', () => {
        inputWord.value = '';
        inputIpa.value = '';
        inputCustomPos.value = '';
        inputDefinition.value = '';
        inputExamples.value = '';
        inputSynonyms.value = '';
        inputAntonyms.value = '';
        inputEtymology.value = '';
        
        inputPos.value = 'noun';
        customPosContainer.classList.add('hidden');
        
        updatePreview();
    });

    // IPA Translate Redirect
    btnIpaTranslate.addEventListener('click', () => {
        const word = inputWord.value.trim() || 'word';
        const url = `https://unalengua.com/ipa-translate?ttsLocale=en-GB-WLS&voiceId=Geraint&text=${encodeURIComponent(word)}`;
        window.open(url, '_blank');
    });

    // Initial render
    updatePreview();
});
