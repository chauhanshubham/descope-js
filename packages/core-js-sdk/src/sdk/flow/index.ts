import { apiPaths } from '../../constants';
import { HttpClient } from '../../httpClient';
import { transformResponse } from '../helpers';
import { FlowResponse, Options, SdkResponse } from '../types';
import { stringNonEmpty, withValidations } from '../validations';
import { FlowInput } from './types';

const withStartValidations = withValidations(stringNonEmpty('flowId'));
const withNextValidations = withValidations(
  stringNonEmpty('executionId'),
  stringNonEmpty('stepId'),
  stringNonEmpty('interactionId')
);

const withFlow = (httpClient: HttpClient) => ({
  start: withStartValidations(
    (
      flowId: string,
      options?: Options,
      conditionInteractionId?: string,
      interactionId?: string,
      input?: FlowInput,
      version?: number
    ): Promise<SdkResponse<FlowResponse>> =>
      transformResponse(
        httpClient.post(apiPaths.flow.start, {
          flowId,
          options,
          conditionInteractionId,
          interactionId,
          input,
          version,
        })
      )
  ),
  next: withNextValidations(
    (
      executionId: string,
      stepId: string,
      interactionId: string,
      input?: FlowInput,
      version?: number
    ): Promise<SdkResponse<FlowResponse>> => {
      return transformResponse(
        httpClient.post(apiPaths.flow.next, {
          executionId,
          stepId,
          interactionId,
          input,
          version,
        })
      );
    }
  ),
});

export default withFlow;
