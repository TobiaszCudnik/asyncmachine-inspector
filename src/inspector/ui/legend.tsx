import * as React from 'react'

function State({ classes, radius }) {
  if (!classes) classes = ''
  if (!radius) radius = 15
  return (
    <svg style={{ width: radius * 2 + 4, height: radius * 2 + 4 }}>
      <g
        id="j_19"
        className={`joint-theme-default joint-cell joint-type-fsa joint-type-fsa-state joint-element ${classes}`}
        data-type="fsa.State"
        fill="#ffffff"
        stroke="none"
      >
        <g className="rotatable" id="v-168">
          <g className="scalable" id="v-169">
            <circle
              strokeWidth="3"
              fill="#ffffff"
              stroke="#000000"
              r={radius}
              cx={radius + 2}
              cy={radius + 2}
            />
          </g>
        </g>
      </g>
    </svg>
  )
}

export default function() {
  return (
    <div>
      <div id="overlay" />

      <div className="modal-wrapper">
        <div className="modal-content legend">
          <div>
            <h4>Synchronized states</h4>
            <h5>Active states</h5>
            <ul className="states">
              <li>
                <span>
                  <State classes={'joint-is-set'} />
                </span>
                <span>Regular state</span>
              </li>
              <li>
                <span>
                  <State classes={'joint-is-multi joint-is-set'} />
                </span>
                <span>Multi state</span>
              </li>
            </ul>
            <h5>Inactive states</h5>
            <ul className="states">
              <li>
                <span>
                  <State />
                </span>
                <span>Regular state</span>
              </li>
              <li>
                <span>
                  <State classes={'joint-is-auto'} />
                </span>
                <span>Auto state</span>
              </li>
            </ul>
            <h4>Transition states</h4>
            <h5>Activate</h5>
            <ul className="states">
              <li>
                <span>
                  <State
                    classes={
                      'joint-is-touched joint-step-set joint-step-requested'
                    }
                  />
                </span>
                <span>Activate</span>
              </li>
              <li>
                <span>
                  <State
                    classes={
                      'joint-is-touched joint-step-set joint-step-relation'
                    }
                  />
                </span>
                <span>Activate by a relation</span>
              </li>
              <li>
                <span>
                  <State
                    classes={
                      'joint-is-touched joint-step-set joint-step-requested joint-step-pipe'
                    }
                  />
                </span>
                <span>Activate by piping</span>
              </li>
            </ul>
            <ul className="states">
              <h5>De-activate</h5>
              <li>
                <span>
                  <State
                    classes={
                      'joint-is-touched joint-is-set joint-step-drop joint-step-requested'
                    }
                  />
                </span>
                <span>De-active</span>
              </li>
              <li>
                <span>
                  <State
                    classes={
                      'joint-is-touched joint-is-set joint-step-drop joint-step-relation'
                    }
                  />
                </span>
                <span>De-active by a relation</span>
              </li>
              <li>
                <span>
                  <State
                    classes={
                      'joint-is-touched joint-is-set joint-step-drop joint-step-requested joint-step-pipe'
                    }
                  />
                </span>
                <span>De-active by piping</span>
              </li>
            </ul>
            <ul className="states">
              <h5>Others</h5>
              <li>
                <span>
                  <State classes={'joint-step-cancel'} />
                </span>
                <span>Cancelled</span>
              </li>
            </ul>
          </div>
          <div>
            <h4>Rules</h4>
            <ol>
              <li>
                State can be active or inactive and are grouped in machines
              </li>
              <li>
                State changes are always synchronous and performed by
                transitions
              </li>
              <li>
                States have relations within a single machine and pipes between
                different machines
              </li>
              <li>
                States take part in a transition by either: a request, a
                relation or a pipe
              </li>
              <li>
                Every state taking part in a transition can request it's
                cancellation
              </li>
              <li>
                Auto-states try to set themselves after every state change
              </li>
              <li>
                Transition is valid if all the requested states are accepted
              </li>
              <li>Not all auto-states have to be accepted</li>
              <li>
                Piped transition can, but doesn't have to cancel the parent one
              </li>
              <li>Exception is a state and cancels the current transition</li>
              <li>
                Every state has a counter incremented each time it's activated
              </li>
              <li>
                Multi-state is expected to be activated multiple times (without
                being inactive)
              </li>
              <li>
                Requesting a transition on a machine already executing one goes
                into a queue
              </li>
              <li>
                Transition for a machine can be requested on another machine's
                queue
              </li>
              <li>Auto states gets queued at the beginning of a queue</li>
            </ol>
            <h4>Hotkeys</h4>
            <ul className="states">
              <li>
                <span>SHIFT + ?</span>
                <span>Help menu</span>
              </li>
              <li>
                <span>ALT + LEFT</span>
                <span>Go back in time</span>
              </li>
              <li>
                <span>ALT + RIGHT</span>
                <span>Go fwd in time</span>
              </li>
              <li>
                <span>SPACE</span>
                <span>Pause / Play</span>
              </li>
              <li>
                <span>CTRL + G</span>
                <span>Focus the graph</span>
              </li>
              <li>
                <span>ARROWS</span>
                <span>Move the cursor around the graph</span>
              </li>
            </ul>
            <h4>Relations</h4>
            <h5>Between states</h5>
            <ul className="relations">
              <li>
                <span style={{ float: 'left' }}>
                  <svg style={{ width: 80, height: 25 }}>
                    <g
                      id="j_49"
                      className="joint-cell joint-type-fsa joint-type-fsa-arrow joint-link joint-theme-default joint-add"
                      data-type="fsa.Arrow"
                    >
                      <path
                        className="connection"
                        d="M 0 10 C 70 10 70 10 70 10"
                      />
                      <path
                        className="marker-target"
                        id="v-257"
                        d="M 10 0 L 0 5 L 10 10 z"
                        transform="translate(78,16) scale(1,1) rotate(-175)"
                      />
                      <g className="labels">
                        <g
                          className="label"
                          id="v-253"
                          transform="translate(30, 12)"
                        >
                          <rect
                            id="v-255"
                            fill="#ffffff"
                            rx="3"
                            ry="3"
                            width="20"
                            height="10"
                            transform="matrix(1,0,0,1,-5,-7)"
                          />
                          <text
                            id="v-254"
                            fontSize={10}
                            y="0.8em"
                            textAnchor="right"
                            fill="#000000"
                            pointerEvents="none"
                            transform="matrix(1,0,0,1,-4,-7)"
                          >
                            <tspan id="v-256" className="v-line" dy="0em">
                              add
                            </tspan>
                          </text>
                        </g>
                      </g>
                    </g>
                  </svg>
                </span>
                <span>
                  When the source state gets activated, the target state also
                  gets activated
                </span>
              </li>
              <li>
                <span style={{ float: 'left' }}>
                  <svg style={{ width: 80, height: 25 }}>
                    <g
                      id="j_49"
                      className="joint-cell joint-type-fsa joint-type-fsa-arrow joint-link joint-theme-default joint-require"
                      data-type="fsa.Arrow"
                    >
                      <path
                        className="connection"
                        d="M 0 10 C 70 10 70 10 70 10"
                      />
                      <path
                        className="marker-target"
                        id="v-257"
                        d="M 10 0 L 0 5 L 10 10 z"
                        transform="translate(78,16) scale(1,1) rotate(-175)"
                      />
                      <g className="labels">
                        <g
                          className="label"
                          id="v-253"
                          transform="translate(30, 12)"
                        >
                          <rect
                            id="v-255"
                            fill="#ffffff"
                            rx="3"
                            ry="3"
                            width="43"
                            height="10"
                            transform="matrix(1,0,0,1,-15,-7)"
                          />
                          <text
                            id="v-254"
                            fontSize={10}
                            y="0.8em"
                            textAnchor="right"
                            fill="#000000"
                            pointerEvents="none"
                            transform="matrix(1,0,0,1,-14,-7)"
                          >
                            <tspan id="v-256" className="v-line" dy="0em">
                              require
                            </tspan>
                          </text>
                        </g>
                      </g>
                    </g>
                  </svg>
                </span>
                <span>
                  To get the source state activated, the target states needs to
                  be active (or about to be activated)
                </span>
              </li>
              <li>
                <span style={{ float: 'left' }}>
                  <svg style={{ width: 80, height: 25 }}>
                    <g
                      id="j_49"
                      className="joint-cell joint-type-fsa joint-type-fsa-arrow joint-link joint-theme-default joint-drop"
                      data-type="fsa.Arrow"
                    >
                      <path
                        className="connection"
                        d="M 0 10 C 70 10 70 10 70 10"
                      />
                      <path
                        className="marker-target"
                        id="v-257"
                        d="M 10 0 L 0 5 L 10 10 z"
                        transform="translate(78,16) scale(1,1) rotate(-175)"
                      />
                      <g className="labels">
                        <g
                          className="label"
                          id="v-253"
                          transform="translate(30, 12)"
                        >
                          <rect
                            id="v-255"
                            fill="#ffffff"
                            rx="3"
                            ry="3"
                            width="25"
                            height="10"
                            transform="matrix(1,0,0,1,-9,-7)"
                          />
                          <text
                            id="v-254"
                            fontSize={10}
                            y="0.8em"
                            textAnchor="right"
                            fill="#000000"
                            pointerEvents="none"
                            transform="matrix(1,0,0,1,-8,-7)"
                          >
                            <tspan id="v-256" className="v-line" dy="0em">
                              drop
                            </tspan>
                          </text>
                        </g>
                      </g>
                    </g>
                  </svg>
                </span>
                <span>
                  When the source state gets activated, it tries to de-activate
                  the target state
                </span>
              </li>
            </ul>
            <h5>Between machines</h5>
            <ul className="relations">
              <li>
                <span style={{ float: 'left' }}>
                  <svg style={{ width: 80, height: 25 }}>
                    <g
                      id="j_49"
                      className="joint-cell joint-type-fsa joint-type-fsa-arrow joint-link joint-theme-default joint-add"
                      data-type="fsa.Arrow"
                    >
                      <path
                        className="connection"
                        d="M 0 10 C 70 10 70 10 70 10"
                      />
                      <path
                        className="marker-target"
                        id="v-257"
                        d="M 10 0 L 0 5 L 10 10 z"
                        transform="translate(78,16) scale(1,1) rotate(-175)"
                      />
                      <g className="labels">
                        <g
                          className="label"
                          id="v-253"
                          transform="translate(30, 12)"
                        >
                          <rect
                            id="v-255"
                            fill="#ffffff"
                            rx="3"
                            ry="3"
                            width="20"
                            height="10"
                            transform="matrix(1,0,0,1,-5,-7)"
                          />
                          <text
                            id="v-254"
                            fontSize={10}
                            y="0.8em"
                            textAnchor="right"
                            fill="#000000"
                            pointerEvents="none"
                            transform="matrix(1,0,0,1,-4,-7)"
                          >
                            <tspan id="v-256" className="v-line" dy="0em">
                              add
                            </tspan>
                          </text>
                        </g>
                      </g>
                    </g>
                  </svg>
                </span>
                <span>
                  When the source changes, the target gets the same request
                  (activate == activate / de-activate == de-activate)
                </span>
              </li>
              <li>
                <span style={{ float: 'left' }}>
                  <svg style={{ width: 80, height: 25 }}>
                    <g
                      id="j_49"
                      className="joint-cell joint-type-fsa joint-type-fsa-arrow joint-link joint-theme-default joint-drop"
                      data-type="fsa.Arrow"
                    >
                      <path
                        className="connection"
                        d="M 0 10 C 70 10 70 10 70 10"
                      />
                      <path
                        className="marker-target"
                        id="v-257"
                        d="M 10 0 L 0 5 L 10 10 z"
                        transform="translate(78,16) scale(1,1) rotate(-175)"
                      />
                      <g className="labels">
                        <g
                          className="label"
                          id="v-253"
                          transform="translate(30, 12)"
                        >
                          <rect
                            id="v-255"
                            fill="#ffffff"
                            rx="3"
                            ry="3"
                            width="25"
                            height="10"
                            transform="matrix(1,0,0,1,-9,-7)"
                          />
                          <text
                            id="v-254"
                            fontSize={10}
                            y="0.8em"
                            textAnchor="right"
                            fill="#000000"
                            pointerEvents="none"
                            transform="matrix(1,0,0,1,-8,-7)"
                          >
                            <tspan id="v-256" className="v-line" dy="0em">
                              drop
                            </tspan>
                          </text>
                        </g>
                      </g>
                    </g>
                  </svg>
                </span>
                <span>
                  When the source changes, the target gets the inverted request
                  (activate == de-activate / de-activate == activate)
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
