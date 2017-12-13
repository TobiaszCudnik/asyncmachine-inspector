import * as React from 'react'

function State({ classes, radius }) {
  if (!classes) classes = ''
  if (!radius) radius = 15
  return (
    <svg style={{width: radius*2+4, height: radius*2+4}}>
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
              cx={radius+2}
              cy={radius+2}
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
          <div style={{ width: '50%', display: 'inline-block' }}>
            <h4>Non-transition states</h4>
            <ul className="states">
              <li>
                <span>
                  <State />
                </span>
                <span>A non-set state</span>
              </li>
              <li>
                <span>
                  <State classes={'is-auto'} />
                </span>
                <span>A non-set auto-state</span>
              </li>
              <li>
                <span>
                  <State classes={'is-set'} />
                </span>
                <span>A set state</span>
              </li>
              <li>
                <span>
                  <State classes={'is-multi is-set'} />
                </span>
                <span>A set multi-state</span>
              </li>
            </ul>
          </div>
          <div style={{ width: '50%', display: 'inline-block' }}>
            <h4>Transition states</h4>
            <ul className="states">
              <li>
                <span>
                  <State classes={'step-requested'} />
                </span>
                <span>A requested state</span>
              </li>
              <li>
                <span>
                  <State classes={'step-requested step-pipe'} />
                </span>
                <span>A piped state</span>
              </li>
              <li>
                <span>
                  <State classes={'step-set'} />
                </span>
                <span>A state to be set</span>
              </li>
              <li>
                <span>
                  <State classes={'step-drop'} />
                </span>
                <span>A state to be unset</span>
              </li>
              <li>
                <span>
                  <State classes={'step-cancel'} />
                </span>
                <span>Transition cancelled</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
