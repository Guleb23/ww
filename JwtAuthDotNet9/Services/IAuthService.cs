using jjj.Entities;
using jjj.Models;

namespace jjj.Services
{
    public interface IAuthService
    {
        Task<TokenResponseDto?> RegisterAsync(UserDto request);
        Task<TokenResponseDto?> LoginAsync(UserDto request);
        Task<TokenResponseDto?> RefreshTokensAsync(RefreshTokenRequestDto request);
    }
}
