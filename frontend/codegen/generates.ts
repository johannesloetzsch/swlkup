import { useQuery, UseQueryOptions } from 'react-query';
import { fetcher } from './fetcher';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The 'Long' scalar type represents non-fractional signed whole numeric values. Long can represent values between -(2^64) and 2^64 - 1. */
  Long: any;
};

export type Contacts = {
  __typename?: 'Contacts';
  phone?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
};

export type Location = {
  __typename?: 'Location';
  zip?: Maybe<Scalars['String']>;
  lon?: Maybe<Scalars['String']>;
  lat?: Maybe<Scalars['String']>;
  radius_kilometer?: Maybe<Scalars['String']>;
  address_string?: Maybe<Scalars['String']>;
};


/** If this server supports mutation, the type that mutation operations will be rooted at. */
export type MutationType = {
  __typename?: 'MutationType';
  /** Add a new supervisor account to the database and send a mail containing the password via mail */
  supervisor_register: Scalars['Boolean'];
};


/** If this server supports mutation, the type that mutation operations will be rooted at. */
export type MutationTypeSupervisor_RegisterArgs = {
  mail: Scalars['String'];
};

/** The type that query operations will be rooted at. */
export type QueryType = {
  __typename?: 'QueryType';
  /** All supervisors visible to the ngo assiged to the token */
  lookup: Lookup;
  /** All languages */
  languages: Array<Languages>;
  /** All offers */
  offers: Array<Offers>;
};


/** The type that query operations will be rooted at. */
export type QueryTypeLookupArgs = {
  token: Scalars['String'];
};

/** All languages */
export type Languages = {
  __typename?: 'languages';
  /** Self descriptive. */
  id: Scalars['String'];
  /** Self descriptive. */
  name: Scalars['String'];
  /** Self descriptive. */
  flag_url: Scalars['String'];
};

/** All supervisors visible to the ngo assiged to the token */
export type Lookup = {
  __typename?: 'lookup';
  /** Self descriptive. */
  valid: Scalars['Boolean'];
  /** Self descriptive. */
  ngo?: Maybe<Ngo>;
  /** Self descriptive. */
  supervisors?: Maybe<Array<Supervisors>>;
};

/** Details of a ngo */
export type Ngo = {
  __typename?: 'ngo';
  name?: Maybe<Scalars['String']>;
};

/** All offers */
export type Offers = {
  __typename?: 'offers';
  /** Self descriptive. */
  id: Scalars['String'];
  /** Self descriptive. */
  target: Scalars['String'];
  /** Self descriptive. */
  desc: Scalars['String'];
};

/** All supervisor visible with the used credentials */
export type Supervisors = {
  __typename?: 'supervisors';
  /** Self descriptive. */
  id: Scalars['ID'];
  name_full?: Maybe<Scalars['String']>;
  languages: Array<Scalars['String']>;
  offers: Array<Scalars['String']>;
  /** Self descriptive. */
  contacts: Contacts;
  /** Self descriptive. */
  location: Location;
  photo?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
};

export type LookupQueryVariables = Exact<{
  token?: Maybe<Scalars['String']>;
}>;


export type LookupQuery = (
  { __typename?: 'QueryType' }
  & { lookup: (
    { __typename?: 'lookup' }
    & Pick<Lookup, 'valid'>
    & { ngo?: Maybe<(
      { __typename?: 'ngo' }
      & Pick<Ngo, 'name'>
    )>, supervisors?: Maybe<Array<(
      { __typename?: 'supervisors' }
      & Pick<Supervisors, 'id' | 'name_full' | 'photo' | 'languages' | 'offers' | 'text'>
      & { contacts: (
        { __typename?: 'Contacts' }
        & Pick<Contacts, 'phone' | 'email' | 'website'>
      ) }
    )>> }
  ), languages: Array<(
    { __typename?: 'languages' }
    & Pick<Languages, 'id' | 'name' | 'flag_url'>
  )>, offers: Array<(
    { __typename?: 'offers' }
    & Pick<Offers, 'id' | 'target' | 'desc'>
  )> }
);


export const LookupDocument = `
    query Lookup($token: String = "R4nd0m") {
  lookup(token: $token) {
    valid
    ngo {
      name
    }
    supervisors {
      id
      name_full
      photo
      languages
      offers
      contacts {
        phone
        email
        website
      }
      text
    }
  }
  languages {
    id
    name
    flag_url
  }
  offers {
    id
    target
    desc
  }
}
    `;
export const useLookupQuery = <
      TData = LookupQuery,
      TError = unknown
    >(
      variables?: LookupQueryVariables, 
      options?: UseQueryOptions<LookupQuery, TError, TData>
    ) => 
    useQuery<LookupQuery, TError, TData>(
      ['Lookup', variables],
      fetcher<LookupQuery, LookupQueryVariables>(LookupDocument, variables),
      options
    );