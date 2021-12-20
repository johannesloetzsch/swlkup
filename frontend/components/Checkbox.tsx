import * as React from 'react';
import styles from '../styles/Checkbox.module.css'

/* A checkbox that when indeterminate indicates being selected
   Inspired by this guide: https://enzymeui.com/blog/how-to-style-checkbox-with-css */

export function Checkbox({children, name, value, id, onChange, refInput}:
			 {children?: React.ReactNode, name?: string, value?: string, id?: string,
                          onChange?: (_:any) => any, refInput?: (_:any)=> any}) {
  return (
    <span>
      <label className={styles.label}>
        <input className={styles.input} type="checkbox" id={id} name={name} value={value} onChange={onChange} ref={refInput}/>
        <span className={styles.indicator}></span>
        <span className={styles.labeltext}>{ children }</span>
      </label>
      <wbr/>  {/** The label has `white-space:nowrap`, but we add a word break opportunity behind **/}
    </span>
  )
}
