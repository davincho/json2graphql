import React, { Component } from 'react';

import { Input, Tag } from 'antd';
import styled from 'react-emotion';
import prettier from 'prettier/standalone';
import graphql from 'prettier/parser-graphql';

import { convertString } from './converter';

import 'antd/dist/antd.css';

const Container = styled('div')({
  display: 'flex',
  alignItems: 'center',
  '& > *': {
    padding: 8,
    margin: 16
  }
});

const Credits = styled('div')({
  margin: 16
});

const GithubImage = styled('img')({
  position: 'absolute',
  top: 0,
  right: 0,
  border: 0,
  zIndex: 2
});

class App extends Component {
  state = {
    output: null,
    input: null,
    rootType: null
  };

  componentDidMount() {
    // Try to initialize from hash
    if (document.location.hash && document.location.hash.length > 1) {
      try {
        const values = JSON.parse(
          decodeURIComponent(document.location.hash.substr(1))
        );
        this.setState({
          input: values.input || null,
          rootType: values.rootType || null
        });
      } catch (e) {}
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.input !== prevState.input ||
      this.state.rootType !== prevState.rootType
    ) {
      this.generateOutput();

      document.location.hash = JSON.stringify({
        input: this.state.input || {},
        rootType: this.state.rootType || {}
      });
    }
  }

  generateOutput = () => {
    let output;

    if (!this.state.input) {
      return;
    }

    try {
      output = prettier.format(
        convertString(this.state.input, this.state.rootType || 'Root'),
        {
          semi: false,
          parser: 'graphql',
          plugins: [graphql]
        }
      );
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({
        output
      });
    }
  };

  render() {
    return (
      <div>
        <a
          href="https://github.com/davincho/json2graphql"
          rel="noopener noreferrer"
          target="_blank"
        >
          <GithubImage
            src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png"
            alt="Fork me on GitHub"
          />
        </a>

        <Credits>
          <h1>JSON to GraphQL Schema</h1>

          <Tag>
            <a
              href="https://ant.design/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Ant-Design
            </a>
          </Tag>
          <Tag>
            <a
              href="https://prettier.io"
              rel="noopener noreferrer"
              target="_blank"
            >
              Prettier
            </a>
          </Tag>
        </Credits>
        <Container>
          <Input
            placeholder="Root name, default: Root"
            value={this.state.rootType}
            onChange={event => this.setState({ rootType: event.target.value })}
          />
        </Container>

        <Container>
          <Input.TextArea
            placeholder="Paste here your JSON"
            rows={25}
            value={this.state.input}
            onChange={event => this.setState({ input: event.target.value })}
          />
          <div>=></div>
          <Input.TextArea
            placeholder="Output"
            rows={25}
            value={this.state.output}
          />
        </Container>
      </div>
    );
  }
}

export default App;
