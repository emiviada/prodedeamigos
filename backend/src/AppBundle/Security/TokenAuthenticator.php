<?php
namespace AppBundle\Security;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Guard\AbstractGuardAuthenticator;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\User\UserProviderInterface;

use AppBundle\Entity\User;

class TokenAuthenticator extends AbstractGuardAuthenticator
{
    /**
     * Called on every request. Return whatever credentials you want to
     * be passed to getUser(). Returning null will cause this authenticator
     * to be skipped.
     */
    public function getCredentials(Request $request)
    {
        if (!$token = $request->headers->get('X-PRODE-AUTH-TOKEN')) {
            // No token?
            $token = null;
        }

        // What you return here will be passed to getUser() as $credentials
        return array(
            'token' => $token,
        );
    }

    /**
     * getUser() method
     * @param array $credentials
     * @param UserProviderInterface $userProvider
     */
    public function getUser($credentials, UserProviderInterface $userProvider)
    {
        $token = $credentials['token'];

        if (null === $token) {
            return;
        }

        list($username, $password) = explode(':', $token);

        // if null, authentication will fail
        // if a User object, checkCredentials() is called
        return $userProvider->loadUserByUsername($username);
    }

    /**
     * checkCredentials() method
     * @param array $credentials
     * @param UserInterface $user
     */
    public function checkCredentials($credentials, UserInterface $user)
    {
        $check = false;
        // check credentials - e.g. make sure the password is valid
        list($username, $password) = explode(':', $credentials['token']);
        if ($user->getPassword() === $password) {
            $check = true;
        }

        // return true to cause authentication success
        return $check;
    }

    /**
     * onAuthenticationSuccess() method
     * @param Request $request
     * @param TokenInterface $token
     * @param void $providerKey
     */
    public function onAuthenticationSuccess(Request $request, TokenInterface $token, $providerKey)
    {
        // on success, let the request continue
        return null;
    }

    /**
     * onAuthenticationFailure() method
     * @param Request $request
     * @param AuthenticationException $exception
     */
    public function onAuthenticationFailure(Request $request, AuthenticationException $exception)
    {
        $data = array(
            'error' => strtr($exception->getMessageKey(), $exception->getMessageData())

            // or to translate this message
            // $this->translator->trans($exception->getMessageKey(), $exception->getMessageData())
        );

        return new JsonResponse($data, Response::HTTP_FORBIDDEN);
    }

    /**
     * Called when authentication is needed, but it's not sent
     */
    public function start(Request $request, AuthenticationException $authException = null)
    {
        $data = array(
            // you might translate this message
            'message' => 'Authentication Required'
        );

        return new JsonResponse($data, Response::HTTP_UNAUTHORIZED);
    }

    public function supportsRememberMe()
    {
        return false;
    }
}
