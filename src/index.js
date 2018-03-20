import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { combineReducers, createStore, applyMiddleware } from "redux";
import "antd/dist/antd.css";

if(process.env.NODE_ENV !== 'production'){
  window.Perf = require('react-addons-perf');
}

const jeditor = require("../package/index.js");

// const JEditor1 = jeditor()
const JEditor2 = jeditor()

let schema = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "status": {
      "type": "number"
    },
    "newMindmap": {
      "type": "object",
      "properties": {
        "create_date": {
          "type": "number"
        },
        "xxx": {
          "type": "number"
        },
        "editor_id": {
          "type": "string"
        },
        "yyy": {
          "type": "number"
        },
        "ispublic": {
          "type": "number"
        },
        "json": {
          "type": "object",
          "properties": {
            "root": {
              "type": "object",
              "properties": {
                "data": {
                  "type": "object",
                  "properties": {
                    "text": {
                      "type": "string"
                    },
                    "expandState": {
                      "type": "string"
                    },
                    "checklistDataOffsetBean": {
                      "type": "null"
                    },
                    "color": {
                      "type": "string"
                    }
                  }
                },
                "children": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "data": {
                        "type": "object",
                        "properties": {
                          "textfgfgfgfgfgff": {
                            "type": "string"
                          },
                          "expandState": {
                            "type": "string"
                          },
                          "checklistDataOffsetBean": {
                            "type": "null"
                          },
                          "color": {
                            "type": "string"
                          }
                        },
                        "required": [
                          "textfgfgfgfgfgff"
                        ]
                      },
                      "children": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "data": {
                              "type": "object",
                              "properties": {
                                "text": {
                                  "type": "string"
                                },
                                "expandState": {
                                  "type": "string"
                                },
                                "checklistDataOffsetBean": {
                                  "type": "null"
                                },
                                "color": {
                                  "type": "string"
                                },
                                "priority": {
                                  "type": "number"
                                },
                                "id": {
                                  "type": "string"
                                },
                                "created": {
                                  "type": "number"
                                }
                              }
                            },
                            "children": {
                              "type": "array",
                              "items": {
                                "type": "object",
                                "properties": {
                                  "data": {
                                    "type": "object",
                                    "properties": {
                                      "id": {
                                        "type": "string"
                                      },
                                      "created": {
                                        "type": "number"
                                      },
                                      "text": {
                                        "type": "string"
                                      },
                                      "progress": {
                                        "type": "number"
                                      },
                                      "caseExtendField": {
                                        "type": "object",
                                        "properties": {
                                          "assigneeAccount": {
                                            "type": "string"
                                          },
                                          "assigneeName": {
                                            "type": "string"
                                          },
                                          "caseDesc": {
                                            "type": "string"
                                          },
                                          "caseToBugList": {
                                            "type": "array",
                                            "items": {}
                                          },
                                          "checklistId": {
                                            "type": "number"
                                          },
                                          "createTime": {
                                            "type": "object",
                                            "properties": {
                                              "date": {
                                                "type": "number"
                                              },
                                              "day": {
                                                "type": "number"
                                              },
                                              "hours": {
                                                "type": "number"
                                              },
                                              "minutes": {
                                                "type": "number"
                                              },
                                              "month": {
                                                "type": "number"
                                              },
                                              "seconds": {
                                                "type": "number"
                                              },
                                              "time": {
                                                "type": "number"
                                              },
                                              "timezoneOffset": {
                                                "type": "number"
                                              },
                                              "year": {
                                                "type": "number"
                                              }
                                            }
                                          },
                                          "executeAccount": {
                                            "type": "string"
                                          },
                                          "executeNames": {
                                            "type": "string"
                                          },
                                          "id": {
                                            "type": "number"
                                          },
                                          "imgUrls": {
                                            "type": "string"
                                          },
                                          "isClose": {
                                            "type": "number"
                                          },
                                          "isDel": {
                                            "type": "number"
                                          },
                                          "leafId": {
                                            "type": "string"
                                          },
                                          "pmoId": {
                                            "type": "string"
                                          },
                                          "priority": {
                                            "type": "string"
                                          },
                                          "relatedBugs": {
                                            "type": "string"
                                          },
                                          "status": {
                                            "type": "number"
                                          },
                                          "suggestion": {
                                            "type": "string"
                                          },
                                          "title": {
                                            "type": "string"
                                          },
                                          "updateTime": {
                                            "type": "object",
                                            "properties": {
                                              "date": {
                                                "type": "number"
                                              },
                                              "day": {
                                                "type": "number"
                                              },
                                              "hours": {
                                                "type": "number"
                                              },
                                              "minutes": {
                                                "type": "number"
                                              },
                                              "month": {
                                                "type": "number"
                                              },
                                              "seconds": {
                                                "type": "number"
                                              },
                                              "time": {
                                                "type": "number"
                                              },
                                              "timezoneOffset": {
                                                "type": "number"
                                              },
                                              "year": {
                                                "type": "number"
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  },
                                  "children": {
                                    "type": "array",
                                    "items": {
                                      "type": "object",
                                      "properties": {
                                        "data": {
                                          "type": "object",
                                          "properties": {
                                            "id": {
                                              "type": "string"
                                            },
                                            "created": {
                                              "type": "number"
                                            },
                                            "text": {
                                              "type": "string"
                                            },
                                            "caseExtendField": {
                                              "type": "object",
                                              "properties": {
                                                "assigneeAccount": {
                                                  "type": "string"
                                                },
                                                "assigneeName": {
                                                  "type": "string"
                                                },
                                                "caseDesc": {
                                                  "type": "string"
                                                },
                                                "caseToBugList": {
                                                  "type": "array",
                                                  "items": {
                                                    "type": "object",
                                                    "properties": {
                                                      "bugId": {
                                                        "type": "number"
                                                      },
                                                      "status": {
                                                        "type": "boolean"
                                                      }
                                                    },
                                                    "required": [
                                                      "bugId",
                                                      "status"
                                                    ]
                                                  }
                                                },
                                                "checklistId": {
                                                  "type": "number"
                                                },
                                                "createTime": {
                                                  "type": "object",
                                                  "properties": {
                                                    "date": {
                                                      "type": "number"
                                                    },
                                                    "day": {
                                                      "type": "number"
                                                    },
                                                    "hours": {
                                                      "type": "number"
                                                    },
                                                    "minutes": {
                                                      "type": "number"
                                                    },
                                                    "month": {
                                                      "type": "number"
                                                    },
                                                    "seconds": {
                                                      "type": "number"
                                                    },
                                                    "time": {
                                                      "type": "number"
                                                    },
                                                    "timezoneOffset": {
                                                      "type": "number"
                                                    },
                                                    "year": {
                                                      "type": "number"
                                                    }
                                                  }
                                                },
                                                "executeAccount": {
                                                  "type": "string"
                                                },
                                                "executeNames": {
                                                  "type": "string"
                                                },
                                                "id": {
                                                  "type": "number"
                                                },
                                                "imgUrls": {
                                                  "type": "string"
                                                },
                                                "isClose": {
                                                  "type": "number"
                                                },
                                                "isDel": {
                                                  "type": "number"
                                                },
                                                "leafId": {
                                                  "type": "string"
                                                },
                                                "pmoId": {
                                                  "type": "string"
                                                },
                                                "priority": {
                                                  "type": "string"
                                                },
                                                "relatedBugs": {
                                                  "type": "string"
                                                },
                                                "status": {
                                                  "type": "number"
                                                },
                                                "suggestion": {
                                                  "type": "string"
                                                },
                                                "title": {
                                                  "type": "string"
                                                },
                                                "updateTime": {
                                                  "type": "object",
                                                  "properties": {
                                                    "date": {
                                                      "type": "number"
                                                    },
                                                    "day": {
                                                      "type": "number"
                                                    },
                                                    "hours": {
                                                      "type": "number"
                                                    },
                                                    "minutes": {
                                                      "type": "number"
                                                    },
                                                    "month": {
                                                      "type": "number"
                                                    },
                                                    "seconds": {
                                                      "type": "number"
                                                    },
                                                    "time": {
                                                      "type": "number"
                                                    },
                                                    "timezoneOffset": {
                                                      "type": "number"
                                                    },
                                                    "year": {
                                                      "type": "number"
                                                    }
                                                  }
                                                }
                                              }
                                            },
                                            "image": {
                                              "type": "string"
                                            },
                                            "imageTitle": {
                                              "type": "string"
                                            },
                                            "imageSize": {
                                              "type": "object",
                                              "properties": {
                                                "width": {
                                                  "type": "number"
                                                },
                                                "height": {
                                                  "type": "number"
                                                }
                                              }
                                            }
                                          }
                                        },
                                        "children": {
                                          "type": "array",
                                          "items": {
                                            "type": "object",
                                            "properties": {
                                              "data": {
                                                "type": "object",
                                                "properties": {
                                                  "id": {
                                                    "type": "string"
                                                  },
                                                  "created": {
                                                    "type": "number"
                                                  },
                                                  "text": {
                                                    "type": "string"
                                                  },
                                                  "caseExtendField": {
                                                    "type": "object",
                                                    "properties": {
                                                      "assigneeAccount": {
                                                        "type": "string"
                                                      },
                                                      "assigneeName": {
                                                        "type": "string"
                                                      },
                                                      "caseDesc": {
                                                        "type": "string"
                                                      },
                                                      "caseToBugList": {
                                                        "type": "array",
                                                        "items": {
                                                          "type": "object",
                                                          "properties": {
                                                            "bugId": {
                                                              "type": "number"
                                                            },
                                                            "status": {
                                                              "type": "boolean"
                                                            }
                                                          }
                                                        }
                                                      },
                                                      "checklistId": {
                                                        "type": "number"
                                                      },
                                                      "createTime": {
                                                        "type": "object",
                                                        "properties": {
                                                          "date": {
                                                            "type": "number"
                                                          },
                                                          "day": {
                                                            "type": "number"
                                                          },
                                                          "hours": {
                                                            "type": "number"
                                                          },
                                                          "minutes": {
                                                            "type": "number"
                                                          },
                                                          "month": {
                                                            "type": "number"
                                                          },
                                                          "seconds": {
                                                            "type": "number"
                                                          },
                                                          "time": {
                                                            "type": "number"
                                                          },
                                                          "timezoneOffset": {
                                                            "type": "number"
                                                          },
                                                          "year": {
                                                            "type": "number"
                                                          }
                                                        }
                                                      },
                                                      "executeAccount": {
                                                        "type": "string"
                                                      },
                                                      "executeNames": {
                                                        "type": "string"
                                                      },
                                                      "id": {
                                                        "type": "number"
                                                      },
                                                      "imgUrls": {
                                                        "type": "string"
                                                      },
                                                      "isClose": {
                                                        "type": "number"
                                                      },
                                                      "isDel": {
                                                        "type": "number"
                                                      },
                                                      "leafId": {
                                                        "type": "string"
                                                      },
                                                      "pmoId": {
                                                        "type": "string"
                                                      },
                                                      "priority": {
                                                        "type": "string"
                                                      },
                                                      "relatedBugs": {
                                                        "type": "string"
                                                      },
                                                      "status": {
                                                        "type": "number"
                                                      },
                                                      "suggestion": {
                                                        "type": "string"
                                                      },
                                                      "title": {
                                                        "type": "string"
                                                      },
                                                      "updateTime": {
                                                        "type": "object",
                                                        "properties": {
                                                          "date": {
                                                            "type": "number"
                                                          },
                                                          "day": {
                                                            "type": "number"
                                                          },
                                                          "hours": {
                                                            "type": "number"
                                                          },
                                                          "minutes": {
                                                            "type": "number"
                                                          },
                                                          "month": {
                                                            "type": "number"
                                                          },
                                                          "seconds": {
                                                            "type": "number"
                                                          },
                                                          "time": {
                                                            "type": "number"
                                                          },
                                                          "timezoneOffset": {
                                                            "type": "number"
                                                          },
                                                          "year": {
                                                            "type": "number"
                                                          }
                                                        }
                                                      }
                                                    }
                                                  },
                                                  "image": {
                                                    "type": "string"
                                                  },
                                                  "imageTitle": {
                                                    "type": "string"
                                                  },
                                                  "imageSize": {
                                                    "type": "object",
                                                    "properties": {
                                                      "width": {
                                                        "type": "number"
                                                      },
                                                      "height": {
                                                        "type": "number"
                                                      }
                                                    }
                                                  }
                                                }
                                              },
                                              "children": {
                                                "type": "array",
                                                "items": {}
                                              }
                                            },
                                            "required": [
                                              "data",
                                              "children"
                                            ]
                                          }
                                        }
                                      },
                                      "required": [
                                        "data",
                                        "children"
                                      ]
                                    }
                                  }
                                },
                                "required": [
                                  "data",
                                  "children"
                                ]
                              }
                            }
                          },
                          "required": [
                            "data",
                            "children"
                          ]
                        }
                      }
                    },
                    "required": [
                      "data",
                      "children"
                    ]
                  }
                }
              }
            },
            "template": {
              "type": "string"
            },
            "theme": {
              "type": "string"
            },
            "version": {
              "type": "string"
            }
          }
        },
        "last_editor_id": {
          "type": "string"
        },
        "mubanId": {
          "type": "number"
        },
        "pmo_id": {
          "type": "string"
        },
        "suiteid": {
          "type": "number"
        },
        "title": {
          "type": "string"
        },
        "version": {
          "type": "number"
        }
      },
      "required": [
        "idfgfgfgfgdfgffgfgfgfggfgdflfgkl",
        "create_date"
      ]
    }
  },
  "required": [
    "status"
  ]
}




schema = JSON.stringify(schema, null, '  ')

render(
    <div>
      <a  target="_blank" href="https://github.com/YMFE/json-schema-editor-visual"><h1>JSON-Schema-Editor</h1></a>
      <p style={{fontSize: '16px'}}>
        A json-schema editor of high efficient and easy-to-use, base on React.{" "}
        <a target="_blank" href="https://github.com/YMFE/json-schema-editor-visual">Github</a>        
      </p>
      <br/>
      <h3>该工具已被用于开源接口管理平台： <a  target="_blank" href="https://github.com/ymfe/yapi">YApi</a></h3>

      

      <br/>
      <h2>Example:</h2>
      <hr />
      

      
      {/* <JEditor1
        showEditor={true}
        data={schema}
        onChange={e => {
          console.log("changeValue", e);
        }}
      /> */}

      <JEditor2
        showEditor={true}
        data={schema}
        onChange={e => {
          // console.log("changeValue", e);
        }}

      />
    </div>,
  document.getElementById("root")
);
