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

class App extends Component {
  state = {
    output: null,
    input: null,
    rootType: null
  };

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
    } finally {
      this.setState({
        output
      });
    }
  };

  render() {
    return (
      <div>
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

        <Credits>
          Based on:{' '}
          <Tag>
            <a href="https://ant.design/" target="_blank">
              Ant-Design
            </a>
          </Tag>
          <Tag>
            <a href="https://prettier.io" target="_blank">
              Prettier
            </a>
          </Tag>
        </Credits>
      </div>
    );
  }
}

export default App;
