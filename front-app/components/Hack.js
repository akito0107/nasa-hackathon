import ReactDom from 'react-dom'
import React from 'react'

export default class Hack extends React.Component {
    styles() {
        return {
            modal: {
                blue: "modal modal-blue",
                red: "modal modal-red",
                white: "modal"
            },
            modal_title: {
                blue: "modal-title modal-title-blue",
                red: "modal-title modal-title-red",
                white: "modal-title"
            },
            modal_contents: {
                blue: "modal-contents-big modal-contents-blue",
                red: "modal-contents-big modal-contents-red",
                white: "modal-contents-big"
            },
            modal_hr: {
                blue: "modal-hr modal-hr-blue",
                red: "modal-hr modal-hr-red",
                white: "modal-hr"
            },
            modal_button: {
                blue: "modal-button modal-button-blue",
                red: "modal-button modal-button-red",
                white: "modal-button"
            }
        }
    }

    render() {
        const styles = this.styles();
        var style_modal = styles.modal.white;
        var style_modal_title = styles.modal_title.white;
        var style_modal_contents = styles.modal_contents.white;
        var style_modal_hr = styles.modal_hr.white;
        var style_modal_button = styles.modal_button.white;

        this.props.data.map((team_id)=> {
            if(team_id == 1) {
                style_modal = styles.modal.blue;
                style_modal_title = styles.modal_title.blue;
                style_modal_contents = styles.modal_contents.blue;
                style_modal_hr = styles.modal_hr.blue;
                style_modal_button = styles.modal_button.blue;
            } else if(team_id == 2) {
                style_modal = styles.modal.red;
                style_modal_title = styles.modal_title.red;
                style_modal_contents = styles.modal_contents.red;
                style_modal_hr = styles.modal_hr.red;
                style_modal_button = styles.modal_button.red;
            }
        });

        return(
            <div className={style_modal}>
                <div className="modal-header">
                    <div className={style_modal_title}><p>Action</p></div>
                </div>
                <div className="modal-body">
                    <div><p className={style_modal_contents}>Hack!!!</p></div>
                    <hr className={style_modal_hr} />
                    <div className={style_modal_button}><p>Close</p></div>
                </div>
            </div>
        );
    }
}
