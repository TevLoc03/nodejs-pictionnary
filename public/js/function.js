function verifP(input){
        if(document.getElementById('password').value != input.value)
            input.setCustomValidity('Mot de passe différent');
        else
            input.setCustomValidity('');
    }

    function calculAge() {

        var anniv = new Date(document.getElementById('date').value);

        if(anniv<new Date()) {
            var diffAge = Date.now()-anniv.getTime();
            var date = new Date(diffAge)
            document.getElementById('age').value=Math.abs(date.getUTCFullYear()-1970);
        } else {
            document.getElementById('age').value=0;
        }
    }

    function loadProfilePic(e) {
            // on récupère le canvas où on affichera l'image
            var canvas = document.getElementById("preview");
            var ctx = canvas.getContext("2d");
            // on réinitialise le canvas: on l'efface, et déclare sa largeur et hauteur à 0
            ctx.setFillColor = "grey";
            ctx.fillRect(0,0, 96, 96);
            canvas.width=0;
            canvas.height=0;
			
            // on récupérer le fichier: le premier (et seul dans ce cas là) de la liste
            var file = document.getElementById("profil").files[0];
            // l'élément img va servir à stocker l'image temporairement
            var img = document.createElement("img");
            // l'objet de type FileReader nous permet de lire les données du fichier.
            var reader = new FileReader();
			
            // on prépare la fonction callback qui sera appelée lorsque l'image sera chargée
            reader.onload = function(e) {
				
                //on vérifie qu'on a bien téléchargé une image, grâce au mime type
                if (!file.type.match(/image.*/)) {
					
                    // le fichier choisi n'est pas une image: le champs profilepicfile est invalide, et on supprime sa valeur
                    document.getElementById("profil").setCustomValidity("Il faut télécharger une image.");
                    document.getElementById("profil").value = "";
                    canvas.width = 96;
                    canvas.height = 96;
                }
                else {
					
                    img.src = e.target.result;
                    // le champs profilepicfile est valide
                    document.getElementById("profil").setCustomValidity("");
                    MAX = 96 ;

                    var height = 0;
                    var width = 0;
                    if(img.width >= img.height){
                        min = img.width / MAX;
                        height = img.height / min;
                        width = MAX;
                        if(height > MAX){
                            min = height / MAX;
                            width = width / min;
                            height = MAX;

                        }
                    } else {
                        min = img.height / MAX;
                        width = img.width / min;
                        height = MAX;

                        if(width > MAX){
                            min = width / MAX;
                            height = height / min;
                            width = MAX;

                        }
                    }

                    canvas.width = 96;
                    canvas.height = 96;

                    ctx.drawImage(img, (MAX - width)/2 , (MAX - height)/2, width, height);
                    // on exporte le contenu du canvas (l'image redimensionnée) sous la forme d'une data url
                    dataurl = canvas.toDataURL("image/png");
                    // on donne finalement cette dataurl comme valeur au champs profilepic
                    document.getElementById("photo").value = dataurl;
                }
            };
            // on charge l'image pour de vrai, lorsque ce sera terminé le callback loadProfilePic sera appelé.
            reader.readAsDataURL(file); 
        }         