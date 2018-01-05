import * as React from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

class ConnectionForm extends React.Component<any, any> {
  onSubmit: Function

  constructor({ onSubmit }) {
    super()
    this.state = { url: 'http://localhost:3757/' }

    this.handleURLChange = this.handleURLChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.onSubmit = onSubmit
  }

  handleURLChange(event) {
    this.setState({ url: event.target.value })
  }

  handleSubmit(event) {
    event.preventDefault()
    this.onSubmit(this.state)
  }

  render() {
    return (
      <form className="connection-form" onSubmit={this.handleSubmit}>
        <h2 style={{ margin: 0 }}>Connect to a server</h2>
        <TextField
          floatingLabelText="Server URL"
          onChange={this.handleURLChange}
          value={this.state.url}
        />
        <div>
          <RaisedButton
            type="submit"
            primary={true}
            fullWidth={true}
            label="Connect"
          />
        </div>
      </form>
    )
  }
}

export default function({ onSubmit }) {
  return (
    <div>
      <div id="overlay" />

      <div className="modal-wrapper">
        <div className="modal-content">
          <ConnectionForm onSubmit={onSubmit} />
        </div>
      </div>
    </div>
  )
}
