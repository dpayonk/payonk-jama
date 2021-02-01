import React from 'react';

class MediaUploader extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            'filename': '',
            'image_url': 'https://nyc3.digitaloceanspaces.com/com.payonk.clique/20210114-181146--20210114-174832--stephen-walker-unsplash.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=KSB4OEBLVBM6HPQGPVDM%2F20210115%2Fnyc3%2Fs3%2Faws4_request&X-Amz-Date=20210115T001146Z&X-Amz-Expires=6000&X-Amz-SignedHeaders=host&X-Amz-Signature=2920e95f97ee6d1cbc0895f42ebb181f483c901ffe43943004e327955d20e750'
        };

        this.handleUpload = this.handleUpload.bind(this);
    }

    handleUpload(event) {
        this.upload();
        event.preventDefault();
    }

    async upload() {
        // https://stackoverflow.com/questions/48284011/how-to-post-image-with-fetch
        const fileInput = document.querySelector('#image-input-uploader');
        const formData = new FormData();
        formData.append('picture', fileInput.files[0]);
        let self = this;

        let res = await fetch("https://dev-api.payonk.com/upload", {
            mode: 'cors',
            method: "POST",
            body: formData
        });

        if (res.ok) {
            let responseMessage = await res.json();
            let data = responseMessage.data;
            if (data !== undefined) {
                let picture = data.picture;
                let image_url = data.image_url;
                self.setState({ picture: picture, image_url: image_url });
            } else {
                console.log('Interface error');
            }
        } else if (res.status == 401) {
            alert("Oops! ");
        }
    }

    render() {
        // action="https://dev-api.payonk.com/upload"
        return (
            <div>
                <form method="post" encType="multipart/form-data">
                    <div className="field">
                        <label className="label">File</label>
                        <div className="control">
                            <input className="input" type="file" id="image-input-uploader" name="picture" />
                        </div>
                    </div>
                    <label className="label">Preview</label>
                    <img style={{ maxHeight: "40px" }} src={this.state.image_url} />
                    <button onClick={this.handleUpload} type="submit" name="upload" value="upload" className="button is-primary is-pulled-right">
                        Upload
                    </button>
                    <div>

                    </div>
                </form>

            </div>
        );
    }
}

export default MediaUploader