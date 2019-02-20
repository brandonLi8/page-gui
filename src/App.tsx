import React, { Component, ChangeEvent, Fragment } from 'react';

import './_global.scss';
import './_templates.scss';
import './responsive.scss';

import Ribbon from './Templates/Ribbon';
import RibbonCard from './Templates/RibbonCard';
import SmallRibbonCard from './Templates/SmallRibbonCard';
import Section from './Templates/SectionCard/Section';
import SectionMainBanner from './Templates/SectionCard/SectionMainBanner';
import SectionSubBanner from './Templates/SectionCard/SectionSubBanner';
import SectionCard from './Templates/SectionCard/SectionCard';
import Card from './Templates/Card';
import ImageCard from './Templates/ImageCard';
import FormCreator, { ComponentStructure, GeneratedComponent, ComponentValues, BaseProperty } from './FormCreator/FormCreator';
import TitleCard from './Templates/TitleCard';
import AccordionCard from './Templates/AccordionCard';
import TempCheckList from './Templates/TempCheckList';

import { renderToString } from 'react-dom/server';
import CompileComponents from './FormCreator/CompileComponents';

const generateDefaultValue = (type: BaseProperty) => {
  if (typeof type === 'object' || type === 'component') {
    return [];
  } else if (type === 'boolean') {
    return false;
  } else {
    return '';
  }
}


const mapping: ComponentStructure[] = [
  {
    component: Ribbon,
    name: 'Ribbon',
    propertyTypes: {
      children: 'string'
    }
  },
  {
    component: RibbonCard,
    name: 'Ribbon Card',
    propertyTypes: {
      title: 'string',
      children: 'string'
    }
  },
  {
    component: SmallRibbonCard,
    name: 'Small Ribbon Card',
    propertyTypes: {
      title: 'string',
      children: 'string'
    }
  },
  {
    component: Card,
    name: 'Basic Card',
    propertyTypes: {
      children: 'string'
    }
  },
  {
    component: ImageCard,
    name: 'Image Card',
    propertyTypes: {
      url: 'string',
      children: 'string'
    }
  },
  {
    component: TitleCard,
    name: 'Title Card',
    propertyTypes: {
      title: 'string',
      children: 'string'
    }
  },
  {
    component: AccordionCard,
    name: 'Accordion Card',
    propertyTypes: {
      title: 'string',
      children: 'string'
    }
  },
  // {
  //   component: TempCheckList,
  //   name: 'Check List',
  //   propertyTypes: {
  //     checkboxItems: ['string']
  //   },
  //   defaultValues: {
  //     checkboxItems: []
  //   }
  // },
  {
    component: AccordionCard,
    name: 'TEST ACCORDION CARD',
    propertyTypes: {
      title: 'string',
      children: 'component'
    }
  },
  {
    component: SectionCard,
    name: 'Section',
    propertyTypes: {
      title: 'string',
      children: {
        custom: [
          {
            component: SectionMainBanner,
            name: 'Main Banner',
            propertyTypes: {
              children: 'string'
            }
          },
          {
            component: Section,
            name: 'Body',
            propertyTypes: {
              children: 'string'
            }
          },
          {
            component: SectionSubBanner,
            name: 'Section Sub Banner',
            propertyTypes: {
              children: 'string',
            }
          }
        ]
      }
    }
  },
];

type AppState = { 
  componentList: GeneratedComponent[];
  htmlOutput: string;
};

class App extends Component<{}, AppState> {

  state: AppState = {
    componentList: [],
    htmlOutput: ''
  }

  // HTML LOGIC

  generateHtml = () => {
    const renderedComponents = this.state.componentList.map(info => {
      const componentInfo = mapping.find(structure => structure.name === info.name);
      if (!componentInfo) {
        throw new Error(`Component ${info.name} was not found!`);
      }
      return <componentInfo.component {...info.values}/>
    });
    this.setState({ htmlOutput: renderToString(<div>{renderedComponents}</div>) })
  }

  // FORM LOGIC

  handleAdd = (index: number, generatedComponent: GeneratedComponent) => {
    console.log(`Add \n Index: ${index} \n GeneratedComponent:`);
    console.log(generatedComponent);
    console.log('End Add');
    this.setState({
      componentList: [
        ...this.state.componentList.slice(0, index),
        generatedComponent,
        ...this.state.componentList.slice(index)
      ]
    })
  }

  handleRemove = (index: number) => {
    console.log(`Remove Index: ${index}`);
    this.setState({
      componentList: this.state.componentList.filter((component, ind) => ind !== index)
    });
  }

  handleChange = (index: number, changes: ComponentValues) => {
    console.log(`Change\nIndex: ${index}\nChanges:`);
    console.log(changes);
    console.log('End Changes');
    this.setState({
      componentList: this.state.componentList.map((component, ind) => {
        if (ind === index) {
          return {
            ...component,
            values: changes
          }
        }
        return component;
      })
    })
  }

  render() {

    const htmlOut = !!this.state.htmlOutput ?
      <Fragment>
        <h2>HTML Output</h2>
        {this.state.htmlOutput}
      </Fragment>
      :
      null;

    return (
      <div style={{ display: 'flex', backgroundColor: '#ddd', minHeight: '100vh' }}>
        <div style={{ margin: 'auto', width: '80%', zIndex: 10 }}>

          <FormCreator
            componentTypes={mapping}
            componentList={this.state.componentList}
            onAdd={this.handleAdd}
            onRemove={this.handleRemove}
            onChange={this.handleChange}
            generateDefaultValue={generateDefaultValue}
          />

          <CompileComponents componentList={this.state.componentList} componentTypes={mapping} />

          <button onClick={this.generateHtml}>Generate HTML</button>
          {htmlOut}

          {/* <Ribbon>Title</Ribbon>

          <RibbonCard title="Ribbon Card With Top">
            Hello World
          </RibbonCard>

          <RibbonCard title="Ribbon Card With No Top" noTop>
            Hello World
          </RibbonCard>

          <SmallRibbonCard title="Small Ribbon Card">
            Hello World
          </SmallRibbonCard>

          <SectionCard>
            <SectionMainBanner>Hello World</SectionMainBanner>
            <Section>
              This is the body of the hello world.
            </Section>
            <SectionSubBanner>Contacts</SectionSubBanner>
            <Section>
              Who to call?
              Duh.
              The ghost busters
            </Section>
            <SectionSubBanner>Info</SectionSubBanner>
            <Section>
              Crime Fighting Group!
            </Section>
          </SectionCard>

          <Card>
            This is a card. You can fill it with content. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Card>

          <ImageCard url="https://www.fairviewhs.org/system/photos/6606/original/PSAT_logo.png?1460660946">
            This is a card. You can fill it with content. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </ImageCard>

          <TitleCard title="dfasdfasddfasdfasd">
            asdfasdfasdfasdfasdfasjdklasdfjjkl
            jkladfalksd
          </TitleCard>

          <AccordionCard title="Title For Acod">
            asdfasdfasdfasdfasdfasjdklasdfjjkl
          </AccordionCard>
            */}
            
          <div className="t-card-cont">
            <h2>
              Accordion Title
            </h2>
            <div className="t-checklist">
              <div className="t-checklist-sum">
                Write summary here.
              </div>
              <ul className="t-checklist-crit">
                <li className="t-checklist-item">
                  <div className="t-checklist-box"></div>
                  Item 1
                </li>
                <li className="t-checklist-item">
                  <div className="t-checklist-box"></div>
                  Item 2
                </li>
                <li className="t-checklist-item">
                  <div className="t-checklist-box"></div>
                  Item 3
                </li>
              </ul>
            </div>
          </div> 

        </div>
      </div>
    );
  }
}

export default App;