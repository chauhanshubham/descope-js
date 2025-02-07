// @ts-nocheck
import createSdk from '../../src/sdk';
import jwtDecode from 'jwt-decode';
import { mockHttpClient } from '../utils';
import { apiPaths } from '../../src/constants';

jest.mock('jwt-decode', () => jest.fn());

const sdk = createSdk(mockHttpClient);

describe('sdk', () => {
  afterEach(() => {
    mockHttpClient.reset();
  });

  describe('refresh', () => {
    it('should send the correct request', () => {
      const httpRespJson = { key: 'val' };
      const httpResponse = {
        ok: true,
        json: () => httpRespJson,
        clone: () => ({
          json: () => Promise.resolve(httpRespJson),
        }),
        status: 200,
      };
      mockHttpClient.post.mockResolvedValue(httpResponse);

      sdk.refresh('token');
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        apiPaths.refresh,
        {},
        {
          token: 'token',
        }
      );
    });
  });

  describe('isJwtExpired', () => {
    it('should throw an error when token is not a string', () => {
      expect(sdk.isJwtExpired).toThrow('"token" must be a string');
    });

    it('should throw an error when token is empty', () => {
      expect(() => sdk.isJwtExpired('')).toThrow('"token" must not be empty');
    });

    it('should return true if the JWT is expired', () => {
      (jwtDecode as jest.Mock).mockImplementationOnce(() => ({ exp: 12345 }));
      expect(sdk.isJwtExpired('jwt')).toBe(true);
    });

    it('should return false if the JWT is expired', () => {
      (jwtDecode as jest.Mock).mockImplementationOnce(() => ({
        exp: (new Date().getTime() + 10000) / 1000,
      }));
      expect(sdk.isJwtExpired('jwt')).toBe(false);
    });
  });

  describe('getJwtPermissions', () => {
    const mock = {
      permissions: ['foo', 'bar'],
      tenants: {
        C2EdY4UXXzKPV0EKdZFJbuKKmvtl: {
          roles: ['abc', 'xyz'],
        },
      },
    };

    it('should return two permissions', () => {
      (jwtDecode as jest.Mock).mockImplementation(() => mock);
      expect(sdk.getJwtPermissions('jwt')).toStrictEqual(['foo', 'bar']);
    });
    it('should return empty roles', () => {
      (jwtDecode as jest.Mock).mockImplementation(() => mock);
      expect(sdk.getJwtRoles('jwt')).toStrictEqual([]);
    });
    it('should return empty permissions for tenant', () => {
      (jwtDecode as jest.Mock).mockImplementation(() => mock);
      expect(
        sdk.getJwtPermissions('jwt', 'C2EdY4UXXzKPV0EKdZFJbuKKmvtl')
      ).toStrictEqual([]);
    });
    it('should return two roles for tenant', () => {
      (jwtDecode as jest.Mock).mockImplementation(() => mock);
      expect(
        sdk.getJwtRoles('jwt', 'C2EdY4UXXzKPV0EKdZFJbuKKmvtl')
      ).toStrictEqual(['abc', 'xyz']);
    });
  });

  describe('logout', () => {
    it('should send the correct request', () => {
      const httpRespJson = { key: 'val' };
      const httpResponse = {
        ok: true,
        json: () => httpRespJson,
        clone: () => ({
          json: () => Promise.resolve(httpRespJson),
        }),
        status: 200,
      };
      mockHttpClient.post.mockResolvedValue(httpResponse);

      sdk.logout('token');
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        apiPaths.logout,
        {},
        { token: 'token' }
      );
    });
  });

  describe('logoutAll', () => {
    it('should send the correct request', () => {
      const httpRespJson = { key: 'val' };
      const httpResponse = {
        ok: true,
        json: () => httpRespJson,
        clone: () => ({
          json: () => Promise.resolve(httpRespJson),
        }),
        status: 200,
      };
      mockHttpClient.post.mockResolvedValue(httpResponse);

      sdk.logoutAll('token');
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        apiPaths.logoutAll,
        {},
        { token: 'token' }
      );
    });
  });

  describe('me', () => {
    it('should send the correct request', () => {
      const httpRespJson = { key: 'val' };
      const httpResponse = {
        ok: true,
        json: () => httpRespJson,
        clone: () => ({
          json: () => Promise.resolve(httpRespJson),
        }),
        status: 200,
      };
      mockHttpClient.get.mockResolvedValue(httpResponse);

      sdk.me('token');
      expect(mockHttpClient.get).toHaveBeenCalledWith(apiPaths.me, {
        token: 'token',
      });
    });
  });
});
